import { a } from '@arrirpc/schema'

interface User {
  id: string
  email: string
  created: Date
}

const schema = a.object<User>({
  id: a.string(),
  email: a.string(),
  created: a.timestamp(),
})
