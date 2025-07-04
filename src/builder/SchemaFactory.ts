import { createParseContext } from '../common/ParseContext'
import { failure, ok, success } from '../common/ParseResult'
import type { Refinement } from '../common/Schema'
import { literal } from './literal'
import type { NumericBuilder } from './NumericSchema'
import type { ObjectBuilder, ObjectSchema } from './object'
import type { BaseBuilder, BaseSchema, Schema, SchemaConfig } from './Schema'
import type { SizedBuilder } from './SizedSchema'
import type { StringBuilder } from './string'
import { union } from './union'

interface Interface
  extends BaseBuilder<any>,
    NumericBuilder<any>,
    SizedBuilder<any>,
    StringBuilder,
    ObjectBuilder<any> {}

const propsIfDefined = (
  a: Record<string, any>,
  b: Record<string, any>,
  props: string[],
) => {
  const acc: Record<string, any> = {}
  for (const prop of props) {
    const value = a[prop] ?? b[prop]
    if (value !== undefined) acc[prop] = value
  }
  return acc
}
export class Factory implements Interface {
  readonly name!: SchemaConfig<any>['name']
  readonly parser!: SchemaConfig<any>['parser']
  readonly meta: NonNullable<SchemaConfig<any>['meta']> = {}
  readonly refinements: NonNullable<SchemaConfig<any>['refinements']> = {}
  readonly defaultMaxSize?: number
  readonly guardAs!: Schema<any>['guardAs']

  constructor(config: SchemaConfig<any>) {
    Object.assign(this, config)
    this.guardAs = this.refine.bind(this)
  }

  get ['~standard']() {
    return {
      vendor: 'unhoax',
      version: 1 as const,
      validate: this.parse.bind(this),
    }
  }

  #evolve<U>(config: Partial<SchemaConfig<U>>): this {
    return new (this.constructor as any)({
      name: config.name ?? this.name,
      parser: config.parser ?? this.parser,
      meta: config.meta ?? this.meta,
      refinements: config.refinements ?? this.refinements,
      ...propsIfDefined(config, this, [
        'item', // for iterable schemas
        'props', // for object schemas
        'key', // for record schemas
        'value', // for record schemas
        'defaultMaxSize', // for sized schemas
      ]),
    })
  }

  parse(input: unknown, context = createParseContext(this.name, input)) {
    const result = this.parser(input, context, this as any)
    if (!result.success) return failure(context, this.name, input)
    for (const key in this.refinements)
      if (!this.refinements[key].refine(result.value, this.refinements[key]))
        return failure(context, this.name, result.value, key)

    return success(context, result.value)
  }

  // BaseBuilder
  refine(
    name: string,
    refine: Refinement<any>['refine'],
    config?: Omit<Refinement<any>, 'refine'>,
  ): any {
    const schema = this
    return this.#evolve({
      refinements: {
        ...schema.refinements,
        [name]: { refine, ...config },
      },
    })
  }

  map<U>(
    ...args:
      | [name: string, mapper: (value: any) => U]
      | [mapper: (value: any) => U]
  ): any {
    const [name = this.name, mapper] =
      args.length === 1 ? [undefined, args[0]] : args
    return this.#evolve<U>({
      // flush the refinements because the output has been transformed
      // and refinements no longer apply from this stage.
      refinements: {},
      name,
      parser: (input, context) => {
        const result = this.parse(input, context)
        if (!result.success) return result
        return ok(mapper(result.value))
      },
    })
  }

  convertTo<U>(
    ...args:
      | [name: string, schema: BaseSchema<U>, (value: any) => any]
      | [schema: BaseSchema<U>, (value: any) => any]
  ): any {
    const [name, schema, coerce] =
      args.length === 3 ? args : [args[0].name, args[0], args[1]]
    return this.#evolve({
      // flush the refinements because the output has been transformed
      // and refinements no longer apply from this stage.
      refinements: {},
      name,
      parser: (input, context) => {
        const result = this.parse(input, context)
        if (!result.success) return result
        return schema.parse(coerce(result.value), context)
      },
    })
  }
  recover(getFallback: () => any): any {
    return union(
      this as BaseSchema<any>,
      unknown.map('recovered', getFallback as any),
    )
  }
  optional(defaultValue = undefined): any {
    return union(
      literal(undefined).map(() => defaultValue),
      this as BaseSchema<any>,
    )
  }
  // @ts-ignore
  nullable(defaultValue = null): any {
    return union(
      literal(null).map(() => defaultValue),
      this as BaseSchema<any>,
    )
  }

  // NumericBuilder
  min(min: any, description?: string): any {
    return this.gte(min, description)
  }

  gte(number: any, description?: string): any {
    return this.refine('min', (value) => value >= number, {
      value: number,
      description,
      exclusive: false,
    })
  }
  greaterThan(number: any, description?: string): any {
    return this.gt(number, description)
  }
  gt(number: any, description?: string): any {
    return this.refine('min', (value) => value > number, {
      value: number,
      description,
      exclusive: true,
    })
  }
  max(max: any, description?: string): any {
    return this.lte(max, description)
  }
  lte(number: any, description?: string): any {
    return this.refine('max', (value) => value <= number, {
      value: number,
      description,
      exclusive: false,
    })
  }
  lowerThan(number: any, description?: string): any {
    return this.lt(number, description)
  }
  lt(number: any, description?: string): any {
    return this.refine('max', (value) => value < number, {
      value: number,
      description,
      exclusive: true,
    })
  }

  // SizedBuilder
  size(options: { min?: number; max?: number; description?: string }): any {
    return this.refine(
      'size',
      (value: any, config: { min?: number; max?: number }) => {
        const size = value.length ?? value.size
        // There is always a max, because no infinite stuff.
        return size >= (config.min ?? 0) && size <= config.max!
      },
      {
        min: options.min,
        max: options.max ?? this.defaultMaxSize,
        description: options.description,
      },
    )
  }

  pattern(pattern: RegExp): any {
    return this.refine(
      'pattern',
      (value, config: any) => config.pattern.test(value),
      { pattern },
    )
  }

  // ObjectBuilder
  intersect(otherSchema: ObjectSchema<any>): any {
    return this.#evolve({
      // @ts-ignore the prop exists, no worries. This is backed by tests
      props: { ...(this as any).props, ...otherSchema.props },
    })
  }

  omit(...props: any[]): any {
    const object = (this as any).props
    return this.#evolve({
      // @ts-ignore the prop exists, no worries. This is backed by tests
      props: Object.fromEntries(
        Object.entries(object).filter(([key]) => !props.includes(key)),
      ),
    })
  }

  pick(...props: any[]): any {
    const object = (this as any).props
    return this.#evolve({
      // @ts-ignore the prop exists, no worries. This is backed by tests
      props: Object.fromEntries(
        Object.entries(object).filter(([key]) => props.includes(key)),
      ),
    })
  }
}

export const unknown = new Factory({
  name: 'unknown',
  parser: ok,
}) as Schema<unknown>
