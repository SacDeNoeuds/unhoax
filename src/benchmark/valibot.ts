import * as v from 'valibot'

interface User {
  id: number
  name: string
}

const userSchema1 = v.object({
  id: v.number(),
  name: v.string(),
})
const userSchema2 = v.object<User>({
  id: v.number(),
  name: v.string(),
})
