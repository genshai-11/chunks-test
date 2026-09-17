export type SevenColor = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple'

export type TestMode = 'red' | 'green' | 'blue'

export interface ColorMeta {
  color: SevenColor
  labelEn: string
  labelVi: string
  hex: string
  bgClass: string
  textClass: string
  borderClass: string
  isHot: boolean
}

export interface Learner {
  id: string
  displayName: string
  code: string
  grade?: string
  organizationId?: string
  avatarUrl?: string
}

export interface Teacher {
  id: string
  displayName: string
  email: string
  role: 'admin' | 'teacher'
}
