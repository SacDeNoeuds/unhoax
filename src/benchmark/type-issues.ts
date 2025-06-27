import { z } from 'zod'

const userSchema1 = z.object({
  id: z.number(),
  name: z.string(),
})

type User1 = z.infer<typeof userSchema1>
declare const getUser1: (value: User1) => void
// When I hover on `value`, I get
// (parameter) value: {
//     id: number;
//     name: string;
// }

interface User2 {
  id: number
  name: string
}

declare const getUser2: (value: User2) => void
// When I hover on `value`, I get
// (parameter) value: User2
