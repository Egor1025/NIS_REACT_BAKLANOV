import type { User } from '@/entities/user/model/types'

export interface AuthState {
  accessToken: string | null
  user: User | null
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse extends User {
  accessToken?: string
  token?: string
  refreshToken?: string
}
