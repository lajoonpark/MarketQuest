/* eslint-disable @typescript-eslint/no-explicit-any */
import { differenceInCalendarDays, formatDistanceToNowStrict, isAfter } from 'date-fns'

import { getCurrentProfile } from '@/lib/auth/getUser'
import { prisma } from '@/lib/prisma'
import {
  mockCompanies,
  mockLeaderboard,
  mockLessons,
  mockNews,
  mockPortfolio,
  mockProfile,
  mockQuests,
  mockSeason,
  mockTrades,
  mockUserAchievements,
  mockUserLessons,
  mockUserQuests,
} from '@/lib/mock-data'
import type {
  CompanyRecord,
  LeaderboardEntry,
  NewsRecord,
  PortfolioRecord,
  ProfileRecord,
  SeasonRecord,
  TradeRecord,
  UserAchievementRecord,
  UserLessonRecord,
  UserQuestRecord,
} from '@/lib/types'
import { formatPercent, getPriceChangePercent } from '@/lib/utils'

function toNumber(value: unknown) {
  if (typeof value === 'number') return value
  if (typeof value === 'string') return Number(value)
  if (value && typeof value === 'object' && 'toNumber' in value && typeof (value as { toNumber: () => number }).toNumber === 'function') {
    return (value as { toNumber: () => number }).toNumber()
  }
  return 0
}

function serializeCompany(company: any): CompanyRecord {
  return {
    id: company.id,
    name: company.name,
    ticker: company.ticker,
    sector: company.sector,
    description: company.description,
    currentPrice: toNumber(company.currentPrice),
    previousPrice: toNumber(company.previousPrice),
    volatility: toNumber(company.volatility),
    growthRating: company.growthRating,
    riskRating: company.riskRating,
    sentimentScore: toNumber(company.sentimentScore),
    logoSvg: company.logoSvg,
    createdAt: company.createdAt.toISOString(),
    updatedAt: company.updatedAt.toISOString(),
    priceHistory: (company.priceHistory ?? []).map((point: any) => ({
      recordedAt: point.recordedAt.toISOString(),
      price: toNumber(point.price),
    })),
  }
}

function serializePortfolio(portfolio: any): PortfolioRecord {
  return {
    id: portfolio.id,
    profileId: portfolio.profileId,
    seasonId: portfolio.seasonId,
    cash: toNumber(portfolio.cash),
    createdAt: portfolio.createdAt.toISOString(),
    updatedAt: portfolio.updatedAt.toISOString(),
    season: {
      id: portfolio.season.id,
      name: portfolio.season.name,
      startDate: portfolio.season.startDate.toISOString(),
      endDate: portfolio.season.endDate.toISOString(),
      startingCash: toNumber(portfolio.season.startingCash),
      status: portfolio.season.status,
      createdAt: portfolio.season.createdAt.toISOString(),
    },
    holdings: (portfolio.holdings ?? []).map((holding: any) => ({
      id: holding.id,
      portfolioId: holding.portfolioId,
      companyId: holding.companyId,
      shares: toNumber(holding.shares),
      avgBuyPrice: toNumber(holding.avgBuyPrice),
      totalInvested: toNumber(holding.totalInvested),
      realizedPnl: toNumber(holding.realizedPnl),
      company: serializeCompany(holding.company),
    })),
    trades: (portfolio.trades ?? []).map((trade: any) => ({
      id: trade.id,
      portfolioId: trade.portfolioId,
      companyId: trade.companyId,
      type: trade.type,
      shares: toNumber(trade.shares),
      price: toNumber(trade.price),
      total: toNumber(trade.total),
      createdAt: trade.createdAt.toISOString(),
      company: serializeCompany(trade.company),
    })),
  }
}

function serializeProfile(profile: any): ProfileRecord {
  return {
    id: profile.id,
    userId: profile.userId,
    username: profile.username,
    displayName: profile.displayName,
    avatarUrl: profile.avatarUrl,
    xp: profile.xp,
    level: profile.level,
    currentStreak: profile.currentStreak,
    longestStreak: profile.longestStreak,
    lastLoginDate: profile.lastLoginDate ? profile.lastLoginDate.toISOString() : null,
    createdAt: profile.createdAt.toISOString(),
    updatedAt: profile.updatedAt.toISOString(),
  }
}

export function getMockPortfolioMetrics(portfolio: PortfolioRecord) {
  const holdingsValue = portfolio.holdings.reduce(
    (total, holding) => total + holding.company.currentPrice * holding.shares,
    0
  )
  const investedValue = portfolio.holdings.reduce((total, holding) => total + holding.totalInvested, 0)
  const portfolioValue = portfolio.cash + holdingsValue
  const dailyChange = portfolio.holdings.reduce(
    (total, holding) => total + (holding.company.currentPrice - holding.company.previousPrice) * holding.shares,
    0
  )
  const seasonReturn = ((portfolioValue - portfolio.season.startingCash) / portfolio.season.startingCash) * 100
  const unrealizedPnl = holdingsValue - investedValue
  return {
    holdingsValue,
    investedValue,
    portfolioValue,
    dailyChange,
    seasonReturn,
    unrealizedPnl,
  }
}

export async function getSeason(): Promise<SeasonRecord> {
  try {
    const season = await prisma.season.findFirst({ where: { status: 'active' }, orderBy: { startDate: 'desc' } })
    if (!season) return mockSeason
    return {
      id: season.id,
      name: season.name,
      startDate: season.startDate.toISOString(),
      endDate: season.endDate.toISOString(),
      startingCash: toNumber(season.startingCash),
      status: season.status,
      createdAt: season.createdAt.toISOString(),
    }
  } catch {
    return mockSeason
  }
}

export async function getCompanies(): Promise<CompanyRecord[]> {
  try {
    const companies = await prisma.company.findMany({
      include: {
        priceHistory: {
          orderBy: { recordedAt: 'asc' },
          take: 30,
        },
      },
      orderBy: { name: 'asc' },
    })
    if (!companies.length) return mockCompanies
    return companies.map(serializeCompany)
  } catch {
    return mockCompanies
  }
}

export async function getCompanyByTicker(ticker: string) {
  try {
    const company = await prisma.company.findUnique({
      where: { ticker: ticker.toUpperCase() },
      include: {
        priceHistory: { orderBy: { recordedAt: 'asc' }, take: 30 },
        news: { orderBy: { createdAt: 'desc' }, include: { company: { include: { priceHistory: { orderBy: { recordedAt: 'asc' }, take: 30 } } } } },
      },
    })
    if (!company) {
      return mockCompanies.find((item) => item.ticker === ticker.toUpperCase()) ?? null
    }
    return serializeCompany(company)
  } catch {
    return mockCompanies.find((item) => item.ticker === ticker.toUpperCase()) ?? null
  }
}

export async function getNews(): Promise<NewsRecord[]> {
  try {
    const news = await prisma.marketNews.findMany({
      include: {
        company: { include: { priceHistory: { orderBy: { recordedAt: 'asc' }, take: 30 } } },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })
    if (!news.length) return mockNews
    return news.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      affectedCompanyId: item.affectedCompanyId,
      affectedSector: item.affectedSector,
      impactDirection: item.impactDirection as NewsRecord['impactDirection'],
      impactStrength: toNumber(item.impactStrength),
      createdAt: item.createdAt.toISOString(),
      expiresAt: item.expiresAt.toISOString(),
      company: item.company ? serializeCompany(item.company) : null,
    }))
  } catch {
    return mockNews
  }
}

export async function getProfileBundle(): Promise<{
  profile: ProfileRecord
  portfolio: PortfolioRecord
  season: SeasonRecord
  userQuests: UserQuestRecord[]
  achievements: UserAchievementRecord[]
  lessons: UserLessonRecord[]
}> {
  try {
    const currentProfile = await getCurrentProfile()
    if (!currentProfile) {
      return {
        profile: mockProfile,
        portfolio: mockPortfolio,
        season: mockSeason,
        userQuests: mockUserQuests,
        achievements: mockUserAchievements,
        lessons: mockUserLessons,
      }
    }

    const season = await prisma.season.findFirst({ where: { status: 'active' }, orderBy: { startDate: 'desc' } })
    const portfolio = await prisma.portfolio.findFirst({
      where: { profileId: currentProfile.id },
      include: {
        season: true,
        holdings: { include: { company: { include: { priceHistory: { orderBy: { recordedAt: 'asc' }, take: 30 } } } } },
        trades: { include: { company: { include: { priceHistory: { orderBy: { recordedAt: 'asc' }, take: 30 } } } }, orderBy: { createdAt: 'desc' }, take: 20 },
      },
      orderBy: { createdAt: 'desc' },
    })
    const userQuests = await prisma.userQuest.findMany({
      where: { profileId: currentProfile.id },
      include: { quest: true },
      orderBy: { assignedAt: 'desc' },
      take: 10,
    })
    const achievements = await prisma.userAchievement.findMany({
      where: { profileId: currentProfile.id },
      include: { achievement: true },
      orderBy: { unlockedAt: 'desc' },
      take: 10,
    })
    const lessons = await prisma.userLessonProgress.findMany({
      where: { profileId: currentProfile.id },
      include: { lesson: true },
      orderBy: { completedAt: 'desc' },
      take: 10,
    })

    if (!portfolio || !season) {
      return {
        profile: serializeProfile(currentProfile),
        portfolio: mockPortfolio,
        season: mockSeason,
        userQuests: mockUserQuests,
        achievements: mockUserAchievements,
        lessons: mockUserLessons,
      }
    }

    return {
      profile: serializeProfile(currentProfile),
      portfolio: serializePortfolio(portfolio),
      season: {
        id: season.id,
        name: season.name,
        startDate: season.startDate.toISOString(),
        endDate: season.endDate.toISOString(),
        startingCash: toNumber(season.startingCash),
        status: season.status,
        createdAt: season.createdAt.toISOString(),
      },
      userQuests: userQuests.length
        ? userQuests.map((item) => ({
            id: item.id,
            questId: item.questId,
            profileId: item.profileId,
            progress: item.progress,
            completed: item.completed,
            claimedAt: item.claimedAt ? item.claimedAt.toISOString() : null,
            assignedAt: item.assignedAt.toISOString(),
            quest: {
              id: item.quest.id,
              title: item.quest.title,
              description: item.quest.description,
              type: item.quest.type,
              target: item.quest.target,
              xpReward: item.quest.xpReward,
              icon: item.quest.icon,
            },
          }))
        : mockUserQuests,
      achievements: achievements.length
        ? achievements.map((item) => ({
            id: item.id,
            profileId: item.profileId,
            unlockedAt: item.unlockedAt.toISOString(),
            achievement: {
              id: item.achievement.id,
              title: item.achievement.title,
              description: item.achievement.description,
              icon: item.achievement.icon,
              xpReward: item.achievement.xpReward,
            },
          }))
        : mockUserAchievements,
      lessons: lessons.length
        ? lessons.map((item) => ({
            id: item.id,
            lessonId: item.lessonId,
            profileId: item.profileId,
            completedAt: item.completedAt.toISOString(),
            lesson: {
              id: item.lesson.id,
              title: item.lesson.title,
              slug: item.lesson.slug,
              content: item.lesson.content,
              xpReward: item.lesson.xpReward,
              orderIndex: item.lesson.orderIndex,
            },
          }))
        : mockUserLessons,
    }
  } catch {
    return {
      profile: mockProfile,
      portfolio: mockPortfolio,
      season: mockSeason,
      userQuests: mockUserQuests,
      achievements: mockUserAchievements,
      lessons: mockUserLessons,
    }
  }
}

export async function getDashboardData() {
  const [companies, news, bundle] = await Promise.all([getCompanies(), getNews(), getProfileBundle()])
  const metrics = getMockPortfolioMetrics(bundle.portfolio)
  const leaderboard = await getLeaderboard()
  const currentRank = leaderboard.find((entry) => entry.profile.username === bundle.profile.username)?.rank ?? 3
  const topMovers = [...companies]
    .sort((a, b) => getPriceChangePercent(b.currentPrice, b.previousPrice) - getPriceChangePercent(a.currentPrice, a.previousPrice))
    .slice(0, 5)
  return {
    ...bundle,
    metrics,
    currentRank,
    dailyQuests: bundle.userQuests.slice(0, 3),
    topMovers,
    latestNews: news.slice(0, 3),
    holdings: bundle.portfolio.holdings,
  }
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const season = await prisma.season.findFirst({ where: { status: 'active' }, orderBy: { startDate: 'desc' } })
    if (!season) return mockLeaderboard
    const entries = await prisma.leaderboardSnapshot.findMany({
      where: { seasonId: season.id },
      include: { profile: true },
      orderBy: { rank: 'asc' },
      take: 50,
    })
    if (!entries.length) return mockLeaderboard
    return entries.map((entry) => ({
      id: entry.id,
      profileId: entry.profileId,
      seasonId: entry.seasonId,
      rank: entry.rank,
      portfolioValue: toNumber(entry.portfolioValue),
      returnPct: toNumber(entry.returnPct),
      snapshotAt: entry.snapshotAt.toISOString(),
      profile: {
        id: entry.profile.id,
        username: entry.profile.username,
        displayName: entry.profile.displayName,
        avatarUrl: entry.profile.avatarUrl,
        xp: entry.profile.xp,
        level: entry.profile.level,
      },
    }))
  } catch {
    return mockLeaderboard
  }
}

export async function getProfilePageData() {
  const bundle = await getProfileBundle()
  const metrics = getMockPortfolioMetrics(bundle.portfolio)
  const profitableTrades = bundle.portfolio.trades.filter((trade) => trade.type === 'sell').length
  return {
    ...bundle,
    metrics,
    achievements: bundle.achievements,
    completedLessons: bundle.lessons.length,
    profitableTrades,
  }
}

export async function getTradePageData(selectedTicker?: string) {
  const [companies, bundle] = await Promise.all([getCompanies(), getProfileBundle()])
  const selectedCompany =
    companies.find((company) => company.ticker === selectedTicker?.toUpperCase()) ?? companies[0]
  return {
    companies,
    profile: bundle.profile,
    portfolio: bundle.portfolio,
    selectedCompany,
  }
}

export async function getCompanyPageData(ticker: string) {
  const normalizedTicker = ticker.trim().toUpperCase()
  if (!normalizedTicker) return null

  try {
    const [company, allNews] = await Promise.all([getCompanyByTicker(normalizedTicker), getNews()])
    if (!company) return null
    const relatedNews = allNews.filter(
      (item) => item.company?.ticker === company.ticker || item.affectedSector === company.sector
    )

    const updatedAt = new Date(company.updatedAt)
    const activeFor = Number.isNaN(updatedAt.getTime())
      ? 'moments ago'
      : formatDistanceToNowStrict(updatedAt, { addSuffix: true })

    return {
      company,
      relatedNews,
      changePercent: getPriceChangePercent(company.currentPrice, company.previousPrice),
      activeFor,
    }
  } catch {
    return null
  }
}

export async function getMarketData() {
  const companies = await getCompanies()
  const sorted = [...companies].sort(
    (a, b) => getPriceChangePercent(b.currentPrice, b.previousPrice) - getPriceChangePercent(a.currentPrice, a.previousPrice)
  )
  return {
    companies,
    topGainers: sorted.slice(0, 3),
    topLosers: sorted.slice(-3).reverse(),
  }
}

export async function getPortfolioPageData() {
  const bundle = await getProfileBundle()
  const metrics = getMockPortfolioMetrics(bundle.portfolio)
  const sectorAllocation = Object.values(
    bundle.portfolio.holdings.reduce<Record<string, { sector: string; value: number }>>((acc, holding) => {
      const value = holding.shares * holding.company.currentPrice
      const current = acc[holding.company.sector] ?? { sector: holding.company.sector, value: 0 }
      current.value += value
      acc[holding.company.sector] = current
      return acc
    }, {})
  ).sort((a, b) => b.value - a.value)

  return {
    ...bundle,
    metrics,
    sectorAllocation,
    trades: bundle.portfolio.trades,
  }
}

export async function getQuestsPageData() {
  const bundle = await getProfileBundle()
  return {
    profile: bundle.profile,
    quests: bundle.userQuests.length ? bundle.userQuests : mockUserQuests,
    xpEarnedToday: bundle.userQuests
      .filter((quest) => quest.claimedAt)
      .reduce((total, quest) => total + quest.quest.xpReward, 0),
  }
}

export async function getLearnPageData() {
  const bundle = await getProfileBundle()
  return {
    profile: bundle.profile,
    lessons: mockLessons,
    completedLessons: bundle.lessons,
  }
}

export async function getNewsPageData() {
  const news = await getNews()
  return {
    news,
    activeCount: news.filter((item) => isAfter(new Date(item.expiresAt), new Date())).length,
  }
}

export async function getLeaderboardPageData() {
  const [entries, bundle, season] = await Promise.all([getLeaderboard(), getProfileBundle(), getSeason()])
  const userEntry = entries.find((entry) => entry.profile.username === bundle.profile.username)
  return {
    entries,
    season,
    userEntry,
    podium: entries.slice(0, 3),
  }
}

export async function getMarketSummaryText() {
  const bundle = await getProfileBundle()
  const metrics = getMockPortfolioMetrics(bundle.portfolio)
  const streakAge = bundle.profile.lastLoginDate
    ? differenceInCalendarDays(new Date(), new Date(bundle.profile.lastLoginDate))
    : 0

  return `Level ${bundle.profile.level} trader with a ${bundle.profile.currentStreak}-day streak, ${formatPercent(metrics.seasonReturn)} season return, and ${streakAge === 0 ? 'active today' : 'returning soon'} status.`
}

export const fallbackTradeHistory: TradeRecord[] = mockTrades
export const fallbackQuestTemplates = mockQuests
