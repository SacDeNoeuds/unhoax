import { number, object, string } from 'ts.data.json'

interface User {
  id: number
  name: string
}

const userDecoder = object<User>(
  {
    id: number(),
    name: string(),
  },
  'User',
)
const user2 = object(
  {
    id: number(),
    name: string(),
  },
  'User',
)
