import { initContract } from '@ts-rest/core'
import { tsr } from '@ts-rest/serverless/fetch'
import { z } from 'zod'

interface User {
  id: number
  firstName: string
  lastName: string
}

const userSchema = z.object<User>({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  prop1: z.string(),
  prop2: z.string(),
  prop3: z.string(),
  prop4: z.string(),
  prop5: z.string(),
  prop6: z.string(),
  prop7: z.string(),
  prop8: z.string(),
  prop9: z.string(),
})

const c = initContract()
const contract = c.router(
  {
    getUser: {
      method: 'GET',
      path: '/user/:id',
      responses: {
        200: userSchema,
      },
    },
  },
  { strictStatusCodes: true },
)

export const router = tsr.router(contract, {
  async getUser() {
    return {
      status: 200,
      body: {
        id: 12,
        firstName: '',
        lastName: '',
        email: '',
        prop1: '',
        prop2: '',
        prop3: '',
        prop4: '',
        prop5: '',
        prop6: '',
        prop7: '',
        prop8: '',
        // prop9: '',
      },
    }
  },
})
