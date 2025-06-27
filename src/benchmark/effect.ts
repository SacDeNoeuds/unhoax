import { Schema } from 'effect'

interface Person {
  name: string
}

const personSchema = Schema.Struct<Person>({
  name: Schema.optionalWith(Schema.NonEmptyString, { exact: true }),
})

type Type = Schema.Schema.Type<typeof personSchema>

Schema.decodeSync(personSchema)({ name: undefined })
