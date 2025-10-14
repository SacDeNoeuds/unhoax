export const isUpperCase = (str: string) => str.toUpperCase() === str
export const isCapitalized = (str: string) => isUpperCase(str[0])
export const capitalize = (str: string) => str[0].toUpperCase() + str.slice(1)

// @ts-ignore
export const arrayOfSize = <T = string>(size: number, fill: T = 'x') =>
  new Array(size).fill(fill)

// @ts-ignore
export const setOfSize = (size: number) =>
  new Set(Array.from({ length: size }, (_, i) => String(i + 1)))

// @ts-ignore
export const mapOfSize = (size: number) =>
  new Map<string, string>(
    Array.from({ length: size }, (_, i) => [String(i + 1), `value-${i + 1}`]),
  )
