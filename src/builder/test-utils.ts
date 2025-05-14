export const isUpperCase = (str: string) => str.toUpperCase() === str
export const isCapitalized = (str: string) => isUpperCase(str[0])
export const capitalize = (str: string) => str[0].toUpperCase() + str.slice(1)

// @ts-ignore
export const arrayOfSize = <T = string>(size: number, fill: T = 'x') =>
  new Array(size).fill(fill)

// @ts-ignore
export const setOfSize = <T = string>(size: number, fill: T = 'x') =>
  new Set(arrayOfSize(size, fill))

// @ts-ignore
export const mapOfSize = <T = string>(size: number, keyAndValue: T = 'x') =>
  new Map<T, T>(arrayOfSize(size, [keyAndValue, keyAndValue]))
