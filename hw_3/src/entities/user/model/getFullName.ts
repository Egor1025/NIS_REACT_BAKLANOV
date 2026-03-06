import type { User } from '@/entities/user/model/types'

export const getFullName = (user: User): string => {
  return `${user.firstName} ${user.lastName}`.trim()
}
