import { UserDataType } from 'src/context/types'

export const formatUserData = (user: any): UserDataType => {
  return {
    ...user,
    role: user.roles && user.roles.length > 0 ? user.roles[0].name : 'client',
    fullName: user.name,
    username: user.email
  }
}
