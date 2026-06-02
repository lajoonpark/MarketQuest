export type Sector =
  | 'Technology'
  | 'Food & Retail'
  | 'Energy'
  | 'Healthcare'
  | 'Entertainment'
  | 'Logistics'

export interface PricePoint {
  recordedAt: string
  price: number
}

export interface CompanyRecord {
  id: string
  name: string
  ticker: string
  sector: Sector
  description: string
  currentPrice: number
  previousPrice: number
  volatility: number
  growthRating: number
  riskRating: number
  sentimentScore: number
  logoSvg: string
  createdAt: string
  updatedAt: string
  priceHistory: PricePoint[]
}

export interface HoldingRecord {
  id: string
  portfolioId: string
  companyId: string
  shares: number
  avgBuyPrice: number
  totalInvested: number
  realizedPnl: number
  company: CompanyRecord
}

export interface TradeRecord {
  id: string
  portfolioId: string
  companyId: string
  type: 'buy' | 'sell'
  shares: number
  price: number
  total: number
  createdAt: string
  company: CompanyRecord
}

export interface QuestTemplate {
  id: string
  title: string
  description: string
  type: string
  target: number
  xpReward: number
  icon: string
}

export interface UserQuestRecord {
  id: string
  questId: string
  profileId: string
  progress: number
  completed: boolean
  claimedAt: string | null
  assignedAt: string
  quest: QuestTemplate
}

export interface AchievementRecord {
  id: string
  title: string
  description: string
  icon: string
  xpReward: number
}

export interface UserAchievementRecord {
  id: string
  profileId: string
  unlockedAt: string
  achievement: AchievementRecord
}

export interface LessonRecord {
  id: string
  title: string
  slug: string
  content: string
  xpReward: number
  orderIndex: number
}

export interface UserLessonRecord {
  id: string
  lessonId: string
  profileId: string
  completedAt: string
  lesson: LessonRecord
}

export interface ProfileRecord {
  id: string
  userId: string
  username: string
  displayName: string
  avatarUrl: string | null
  xp: number
  level: number
  currentStreak: number
  longestStreak: number
  lastLoginDate: string | null
  createdAt: string
  updatedAt: string
}

export interface SeasonRecord {
  id: string
  name: string
  startDate: string
  endDate: string
  startingCash: number
  status: string
  createdAt: string
}

export interface PortfolioRecord {
  id: string
  profileId: string
  seasonId: string
  cash: number
  createdAt: string
  updatedAt: string
  season: SeasonRecord
  holdings: HoldingRecord[]
  trades: TradeRecord[]
}

export interface NewsRecord {
  id: string
  title: string
  description: string
  affectedCompanyId: string | null
  affectedSector: string | null
  impactDirection: 'positive' | 'negative' | 'neutral'
  impactStrength: number
  createdAt: string
  expiresAt: string
  company: CompanyRecord | null
}

export interface LeaderboardEntry {
  id: string
  profileId: string
  seasonId: string
  rank: number
  portfolioValue: number
  returnPct: number
  snapshotAt: string
  profile: Pick<ProfileRecord, 'id' | 'username' | 'displayName' | 'avatarUrl' | 'xp' | 'level'>
}
