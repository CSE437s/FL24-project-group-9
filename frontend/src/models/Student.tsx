import { Program } from './Program'

export type Student = {
  id: number
  first_name: string
  last_name: string
  email: string
  programs: Program[]
  grad: string
  career?: string
}
