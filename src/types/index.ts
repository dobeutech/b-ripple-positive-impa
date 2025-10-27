export type PrivacyLevel = 'public' | 'private' | 'recipient-only'
export type PosterVisibility = 'anonymous' | 'first-name' | 'full-profile'
export type VerificationStatus = 'unverified' | 'email-verified' | 'id-verified'
export type NotificationType = 'tagged' | 'liked' | 'shared' | 'account-matched'

export interface User {
  id: string
  email?: string
  firstName: string
  lastName?: string
  username?: string
  avatarUrl?: string
  verificationStatus: VerificationStatus
  interests: string[]
  createdAt: string
  isAnonymousUser: boolean
}

export interface Recipient {
  type: 'user' | 'anonymous'
  userId?: string
  anonymousName?: string
  user?: User
}

export interface Story {
  id: string
  authorId: string
  author?: User
  content: string
  title: string
  recipient: Recipient
  privacy: PrivacyLevel
  posterVisibility: PosterVisibility
  topics: string[]
  likes: string[]
  shares: number
  createdAt: string
  updatedAt: string
  isHiddenByRecipient?: boolean
}

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  storyId: string
  message: string
  read: boolean
  createdAt: string
}

export interface AnonymousPost {
  firstName: string
  recipient: Recipient
  content: string
  title: string
  topics: string[]
}
