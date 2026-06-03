import { addDays, subDays, subHours } from 'date-fns'

import { calculateLevel } from '@/lib/utils'
import type {
  AchievementRecord,
  CompanyRecord,
  LeaderboardEntry,
  LessonRecord,
  NewsRecord,
  PortfolioRecord,
  ProfileRecord,
  QuestTemplate,
  SeasonRecord,
  TradeRecord,
  UserAchievementRecord,
  UserLessonRecord,
  UserQuestRecord,
} from '@/lib/types'

const now = new Date()

const sectorPalettes: Record<string, string[]> = {
  Technology: ['#2563eb', '#4338ca', '#7c3aed', '#1d4ed8', '#5b21b6'],
  'Food & Retail': ['#16a34a', '#f97316', '#65a30d', '#ea580c', '#22c55e'],
  Energy: ['#eab308', '#f59e0b', '#f97316', '#d97706', '#facc15'],
  Healthcare: ['#0f766e', '#059669', '#14b8a6', '#10b981', '#0d9488'],
  Entertainment: ['#db2777', '#9333ea', '#c026d3', '#7c3aed', '#ec4899'],
  Logistics: ['#475569', '#2563eb', '#334155', '#0f172a', '#1d4ed8'],
}

const shapes = ['rounded', 'circle', 'hex', 'diamond', 'shield'] as const

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
}

function createLogo(name: string, sector: string, index: number) {
  const palette = sectorPalettes[sector][index % sectorPalettes[sector].length]
  const accent = sectorPalettes[sector][(index + 2) % sectorPalettes[sector].length]
  const shape = shapes[index % shapes.length]
  const initials = getInitials(name)

  const body = {
    rounded: `<rect x="4" y="4" width="32" height="32" rx="10" fill="url(#g)" />`,
    circle: `<circle cx="20" cy="20" r="16" fill="url(#g)" />`,
    hex: `<path d="M12 7h16l8 13-8 13H12L4 20 12 7Z" fill="url(#g)" />`,
    diamond: `<path d="M20 4l15 16-15 16L5 20 20 4Z" fill="url(#g)" />`,
    shield: `<path d="M20 4l12 5v10c0 8-5.6 13.9-12 17-6.4-3.1-12-9-12-17V9l12-5Z" fill="url(#g)" />`,
  }[shape]

  return `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${palette}" /><stop offset="100%" stop-color="${accent}" /></linearGradient></defs>${body}<text x="20" y="22" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="white" text-anchor="middle" dominant-baseline="middle">${initials}</text></svg>`
}

const companySeeds = [
  ['SkyForge Robotics', 'SKYF', 'Technology', 142.5, 'Automation hardware and adaptive factory systems powering next-gen industrial fleets.', 0.041, 5, 3, 0.79],
  ['NeuralPath AI', 'NRPL', 'Technology', 89.2, 'Enterprise AI workflow software focused on agent orchestration and secure copilots.', 0.052, 4, 4, 0.74],
  ['QuantumLeap Computing', 'QLCP', 'Technology', 234.8, 'High-performance compute platforms selling fictional quantum acceleration clusters.', 0.058, 5, 5, 0.68],
  ['DataMesh Networks', 'DTMH', 'Technology', 67.4, 'Cloud networking backbone provider for resilient edge and campus deployments.', 0.033, 4, 3, 0.63],
  ['CipherShield Security', 'CPSH', 'Technology', 112.6, 'Cybersecurity suite protecting synthetic market infrastructure and enterprise identity.', 0.036, 4, 2, 0.72],
  ['NovaBite Foods', 'NBIT', 'Food & Retail', 45.3, 'Premium prepared meals brand expanding into campus and commuter retail channels.', 0.028, 3, 2, 0.61],
  ['FreshFlow Markets', 'FRSH', 'Food & Retail', 78.9, 'Neighborhood grocery concept blending private-label foods with fast local delivery.', 0.025, 4, 2, 0.66],
  ['CrispCo Snacks', 'CRSP', 'Food & Retail', 34.2, 'Snack foods company known for rapid flavor launches and efficient shelf turnover.', 0.031, 3, 3, 0.58],
  ['GourmetGrid Delivery', 'GMGD', 'Food & Retail', 56.7, 'Chef-led delivery marketplace monetizing suburban demand for premium convenience.', 0.037, 4, 4, 0.62],
  ['HarvestHub Organics', 'HRHB', 'Food & Retail', 28.4, 'Organic staple producer with a loyal subscription base and strong wholesale reach.', 0.024, 3, 2, 0.64],
  ['GreenGrid Energy', 'GRDG', 'Energy', 93.1, 'Renewable power developer balancing solar farms and smart grid software.', 0.029, 4, 3, 0.67],
  ['SolarVault Power', 'SLVT', 'Energy', 71.5, 'Battery-backed solar infrastructure company serving fictional regional utilities.', 0.034, 4, 3, 0.65],
  ['TerraCore Mining', 'TRCM', 'Energy', 44.8, 'Critical minerals producer with cyclical earnings and aggressive capex plans.', 0.049, 3, 5, 0.47],
  ['HydroBlue Utilities', 'HYBL', 'Energy', 38.2, 'Stable hydro utility with recurring revenue from municipal clean-power contracts.', 0.018, 2, 1, 0.57],
  ['FusionWave Nuclear', 'FSWV', 'Energy', 127.3, 'Advanced reactor design firm pitching modular plants to energy-hungry data centers.', 0.054, 5, 5, 0.71],
  ['MedPulse Labs', 'MPLS', 'Healthcare', 156.4, 'Diagnostics company combining remote monitoring and predictive care analytics.', 0.027, 4, 2, 0.73],
  ['GeneStar Biotech', 'GNST', 'Healthcare', 203.7, 'Biotech platform building fictional gene-editing therapies for rare diseases.', 0.061, 5, 5, 0.69],
  ['CureSync Pharma', 'CRSY', 'Healthcare', 88.5, 'Drug pipeline company focused on resilient specialty medicine franchises.', 0.038, 4, 4, 0.59],
  ['NeuroVita Wellness', 'NRVT', 'Healthcare', 61.2, 'Brain health and wellness brand linking digital coaching with medical partners.', 0.026, 3, 2, 0.64],
  ['BioShield Diagnostics', 'BSHD', 'Healthcare', 74.9, 'Fast-turn diagnostic equipment provider expanding into decentralized testing.', 0.032, 4, 3, 0.68],
  ['PixelPeak Studios', 'PXPK', 'Entertainment', 112.3, 'Narrative game studio monetizing live-service expansions and premium releases.', 0.046, 5, 4, 0.7],
  ['StreamWave Media', 'STWV', 'Entertainment', 67.8, 'Advertising-supported streaming network with a deep factual entertainment catalog.', 0.035, 4, 3, 0.61],
  ['ArcadeForge Games', 'ARCF', 'Entertainment', 45.6, 'Multiplayer arcade publisher with fast cadence seasonal updates and cosmetics.', 0.051, 4, 4, 0.65],
  ['VirtualRealm VR', 'VRLM', 'Entertainment', 89.4, 'Immersive hardware and content company chasing a breakout mixed-reality hit.', 0.057, 5, 5, 0.63],
  ['SoundSphere Music', 'SNSP', 'Entertainment', 34.7, 'Music platform optimizing fan clubs, ticketing, and creator subscription tools.', 0.03, 3, 3, 0.56],
  ['AquaLine Shipping', 'AQLN', 'Logistics', 58.3, 'Global shipping operator investing in efficient ports and route optimization.', 0.022, 3, 2, 0.6],
  ['SwiftTrack Freight', 'SWTF', 'Logistics', 72.4, 'Freight brokerage platform pairing same-day capacity with predictive demand tools.', 0.028, 4, 3, 0.63],
  ['NexusPort Logistics', 'NXPT', 'Logistics', 41.8, 'Port and customs workflow business simplifying cross-border movement.', 0.024, 3, 2, 0.58],
  ['CloudRoute Express', 'CLRT', 'Logistics', 63.2, 'Express parcel brand leaning on automation and dense urban micro-hubs.', 0.03, 4, 3, 0.66],
  ['IronPath Rail', 'IRPT', 'Logistics', 54.6, 'Rail freight network operator with durable industrial shipping contracts.', 0.02, 3, 2, 0.55],
] as const

export const mockCompanies: CompanyRecord[] = companySeeds.map((company, index) => {
  const [name, ticker, sector, currentPrice, description, volatility, growthRating, riskRating, sentimentScore] = company
  const previousPrice = Number((currentPrice * (1 - (((index % 7) - 3) * 0.012 + 0.006))).toFixed(2))
  const priceHistory = Array.from({ length: 30 }, (_, historyIndex) => {
    const drift = (historyIndex - 20) * 0.0035
    const seasonal = Math.sin((historyIndex + index) / 3.2) * volatility * 1.6
    const price = currentPrice * (1 + drift + seasonal)
    return {
      recordedAt: subDays(now, 29 - historyIndex).toISOString(),
      price: Number(Math.max(price, 1).toFixed(2)),
    }
  })

  priceHistory[priceHistory.length - 1].price = currentPrice
  priceHistory[priceHistory.length - 2].price = previousPrice

  return {
    id: `company-${ticker.toLowerCase()}`,
    name,
    ticker,
    sector,
    description,
    currentPrice,
    previousPrice,
    volatility,
    growthRating,
    riskRating,
    sentimentScore,
    logoSvg: createLogo(name, sector, index),
    createdAt: subDays(now, 120).toISOString(),
    updatedAt: now.toISOString(),
    priceHistory,
  }
})

export const mockSeason: SeasonRecord = {
  id: 'season-winter-rally',
  name: 'Winter Rally Season',
  startDate: subDays(now, 2).toISOString(),
  endDate: addDays(now, 5).toISOString(),
  startingCash: 10000,
  status: 'active',
  createdAt: subDays(now, 3).toISOString(),
}

export const mockProfile: ProfileRecord = {
  id: 'profile-questpilot',
  userId: 'user-questpilot',
  username: 'questpilot',
  displayName: 'Quest Pilot',
  avatarUrl: null,
  xp: 1860,
  level: calculateLevel(1860),
  currentStreak: 6,
  longestStreak: 14,
  lastLoginDate: now.toISOString(),
  createdAt: subDays(now, 30).toISOString(),
  updatedAt: now.toISOString(),
}

const holdingBlueprints = [
  ['SKYF', 12, 131.4],
  ['GNST', 5, 188.9],
  ['GRDG', 18, 87.2],
  ['FRSH', 16, 74.8],
  ['CLRT', 20, 58.4],
] as const

const holdings = holdingBlueprints.map(([ticker, shares, avgBuyPrice], index) => {
  const company = mockCompanies.find((item) => item.ticker === ticker)!
  return {
    id: `holding-${ticker.toLowerCase()}`,
    portfolioId: 'portfolio-primary',
    companyId: company.id,
    shares,
    avgBuyPrice,
    totalInvested: Number((shares * avgBuyPrice).toFixed(2)),
    realizedPnl: index === 3 ? 42.5 : 0,
    company,
  }
})

export const mockTrades: TradeRecord[] = ([
  ['trade-1', 'buy', 'SKYF', 12, 131.4, subDays(now, 6)],
  ['trade-2', 'buy', 'FRSH', 16, 74.8, subDays(now, 5)],
  ['trade-3', 'buy', 'GNST', 5, 188.9, subDays(now, 4)],
  ['trade-4', 'buy', 'GRDG', 18, 87.2, subDays(now, 2)],
  ['trade-5', 'sell', 'FRSH', 4, 81.6, subHours(now, 20)],
  ['trade-6', 'buy', 'CLRT', 20, 58.4, subHours(now, 8)],
] as const).map(([id, type, ticker, shares, price, date]) => {
  const company = mockCompanies.find((item) => item.ticker === ticker)!
  return {
    id,
    portfolioId: 'portfolio-primary',
    companyId: company.id,
    type,
    shares,
    price,
    total: Number((shares * price).toFixed(2)),
    createdAt: date.toISOString(),
    company,
  }
})

export const mockPortfolio: PortfolioRecord = {
  id: 'portfolio-primary',
  profileId: mockProfile.id,
  seasonId: mockSeason.id,
  cash: 3246.15,
  createdAt: subDays(now, 7).toISOString(),
  updatedAt: now.toISOString(),
  season: mockSeason,
  holdings,
  trades: mockTrades,
}

export const mockQuests: QuestTemplate[] = [
  { id: 'quest-login', title: 'Check the opening bell', description: 'Log in today and keep your streak alive.', type: 'login', target: 1, xpReward: 40, icon: 'Flame' },
  { id: 'quest-trade', title: 'Place a market move', description: 'Execute one trade today.', type: 'trade_count', target: 1, xpReward: 80, icon: 'CandlestickChart' },
  { id: 'quest-buy', title: 'Open a new position', description: 'Buy your first stock of the day.', type: 'buy_count', target: 1, xpReward: 60, icon: 'TrendingUp' },
  { id: 'quest-profit', title: 'Lock in green', description: 'Sell a position for profit.', type: 'profit_sell', target: 1, xpReward: 120, icon: 'BadgeDollarSign' },
  { id: 'quest-view', title: 'Research sprint', description: 'View 3 company pages.', type: 'company_views', target: 3, xpReward: 50, icon: 'Search' },
  { id: 'quest-watchlist', title: 'Scout the market', description: 'Add 3 companies to your watchlist.', type: 'watchlist_add', target: 3, xpReward: 50, icon: 'Eye' },
  { id: 'quest-diversify', title: 'Sector spread', description: 'Hold positions in 3 sectors.', type: 'diversify_sectors', target: 3, xpReward: 120, icon: 'PieChart' },
  { id: 'quest-news', title: 'Read the tape', description: 'Read 3 market news items.', type: 'news_reads', target: 3, xpReward: 55, icon: 'Newspaper' },
  { id: 'quest-learn', title: 'Sharpen your edge', description: 'Complete one lesson.', type: 'lessons_completed', target: 1, xpReward: 90, icon: 'GraduationCap' },
  { id: 'quest-streak', title: 'Show consistency', description: 'Reach a 3-day login streak.', type: 'streak_days', target: 3, xpReward: 110, icon: 'Award' },
]

export const mockUserQuests: UserQuestRecord[] = (
  [
    { id: 'uq-1', questId: 'quest-login', progress: 1, completed: true, claimedAt: null },
    { id: 'uq-2', questId: 'quest-trade', progress: 0, completed: false, claimedAt: null },
    { id: 'uq-3', questId: 'quest-diversify', progress: 2, completed: false, claimedAt: null },
    { id: 'uq-4', questId: 'quest-news', progress: 3, completed: true, claimedAt: now.toISOString() },
    { id: 'uq-5', questId: 'quest-learn', progress: 1, completed: true, claimedAt: null },
  ] as const
).map(({ id, questId, progress, completed, claimedAt }) => ({
  id,
  questId,
  profileId: mockProfile.id,
  progress,
  completed,
  claimedAt,
  assignedAt: subDays(now, 1).toISOString(),
  quest: mockQuests.find((quest) => quest.id === questId)!,
}))

export const mockAchievements: AchievementRecord[] = [
  { id: 'ach-first-trade', title: 'First Trade', description: 'Complete your very first fictional trade.', icon: 'Sparkles', xpReward: 100 },
  { id: 'ach-first-profit', title: 'First Profit', description: 'Close a trade in the green.', icon: 'Gem', xpReward: 120 },
  { id: 'ach-first-loss', title: 'First Loss', description: 'Experience a losing trade and learn from it.', icon: 'ShieldAlert', xpReward: 80 },
  { id: 'ach-3-day-streak', title: '3-Day Streak', description: 'Log in three days in a row.', icon: 'Flame', xpReward: 90 },
  { id: 'ach-7-day-streak', title: '7-Day Streak', description: 'Stay active for a full trading week.', icon: 'FlameKindling', xpReward: 160 },
  { id: 'ach-diversified', title: 'Diversified Investor', description: 'Own holdings across 3 sectors.', icon: 'Layers3', xpReward: 140 },
  { id: 'ach-watchlist', title: 'Watchlist Builder', description: 'Track 3 companies.', icon: 'ListChecks', xpReward: 70 },
  { id: 'ach-reader', title: 'Market Reader', description: 'Read 10 news items.', icon: 'BookOpenCheck', xpReward: 95 },
  { id: 'ach-comeback', title: 'Comeback Trader', description: 'Recover after a losing day.', icon: 'RefreshCcw', xpReward: 150 },
  { id: 'ach-holder', title: 'Long-Term Holder', description: 'Hold a position for 5 days.', icon: 'Clock3', xpReward: 110 },
]

export const mockUserAchievements: UserAchievementRecord[] = [
  { id: 'ua-1', achievementId: 'ach-first-trade', unlockedAt: subDays(now, 6) },
  { id: 'ua-2', achievementId: 'ach-diversified', unlockedAt: subDays(now, 2) },
  { id: 'ua-3', achievementId: 'ach-3-day-streak', unlockedAt: subDays(now, 3) },
  { id: 'ua-4', achievementId: 'ach-holder', unlockedAt: subHours(now, 12) },
].map(({ id, achievementId, unlockedAt }) => ({
  id,
  profileId: mockProfile.id,
  unlockedAt: unlockedAt.toISOString(),
  achievement: mockAchievements.find((achievement) => achievement.id === achievementId)!,
}))

export const mockLessons: LessonRecord[] = [
  { id: 'lesson-stock', title: 'What is a stock?', slug: 'what-is-a-stock', content: "A stock represents a slice of ownership in a company. In MarketQuest, owning shares means your portfolio rises and falls with each fictional company's price moves.", xpReward: 60, orderIndex: 1 },
  { id: 'lesson-diversification', title: 'What is diversification?', slug: 'what-is-diversification', content: 'Diversification spreads your risk across multiple sectors and companies so a single bad move hurts less.', xpReward: 70, orderIndex: 2 },
  { id: 'lesson-volatility', title: 'What is volatility?', slug: 'what-is-volatility', content: 'Volatility measures how sharply prices can move. Higher volatility creates bigger upside and deeper drawdowns.', xpReward: 80, orderIndex: 3 },
  { id: 'lesson-sentiment', title: 'What is market sentiment?', slug: 'what-is-market-sentiment', content: 'Sentiment reflects how optimistic or fearful traders feel, often moving prices before fundamentals catch up.', xpReward: 75, orderIndex: 4 },
  { id: 'lesson-risk', title: 'Why risk management matters', slug: 'why-risk-management-matters', content: 'Position sizing, cash reserves, and discipline help you survive long enough to capitalize on better setups.', xpReward: 90, orderIndex: 5 },
  { id: 'lesson-investing-vs-gambling', title: 'Investing vs. gambling', slug: 'investing-vs-gambling', content: 'Investing uses repeatable reasoning and risk controls, while gambling relies on luck without an edge.', xpReward: 95, orderIndex: 6 },
]

export const mockUserLessons: UserLessonRecord[] = [
  { id: 'ulp-1', lessonId: 'lesson-stock', completedAt: subDays(now, 5) },
  { id: 'ulp-2', lessonId: 'lesson-diversification', completedAt: subDays(now, 3) },
  { id: 'ulp-3', lessonId: 'lesson-volatility', completedAt: subDays(now, 1) },
].map(({ id, lessonId, completedAt }) => ({
  id,
  lessonId,
  profileId: mockProfile.id,
  completedAt: completedAt.toISOString(),
  lesson: mockLessons.find((lesson) => lesson.id === lessonId)!,
}))

interface NewsBlueprint {
  title: string
  description: string
  ticker: string | null
  affectedSector: string | null
  impactDirection: 'positive' | 'negative' | 'neutral'
  impactStrength: number
  createdAt: Date
  expiresAt: Date
}

const newsBlueprints: NewsBlueprint[] = [
  { title: 'Global risk appetite improves as season opens with broad gains.', description: 'A strong early-week tape is lifting most sectors, boosting trader confidence heading into the next leaderboard snapshot.', ticker: null, affectedSector: null, impactDirection: 'positive', impactStrength: 0.42, createdAt: subHours(now, 10), expiresAt: addDays(now, 1) },
  { title: 'SkyForge Robotics wins a multi-year automation contract.', description: 'The fictional manufacturer secured a major fulfillment-center rollout, increasing revenue visibility.', ticker: 'SKYF', affectedSector: null, impactDirection: 'positive', impactStrength: 0.73, createdAt: subHours(now, 5), expiresAt: addDays(now, 2) },
  { title: 'Food retail stocks rise after consumer spending surprises higher.', description: 'Fresh transaction data points to resilient household demand for premium convenience products.', ticker: null, affectedSector: 'Food & Retail', impactDirection: 'positive', impactStrength: 0.48, createdAt: subHours(now, 12), expiresAt: addDays(now, 2) },
  { title: 'PixelPeak Studios delays its flagship expansion pack.', description: 'The studio cited additional polish time, creating short-term pressure on launch expectations.', ticker: 'PXPK', affectedSector: null, impactDirection: 'negative', impactStrength: 0.61, createdAt: subHours(now, 15), expiresAt: addDays(now, 1) },
  { title: 'Energy names soften after weaker-than-expected demand forecasts.', description: 'Analysts trimmed near-term power demand expectations for industrial customers.', ticker: null, affectedSector: 'Energy', impactDirection: 'negative', impactStrength: 0.51, createdAt: subHours(now, 18), expiresAt: addDays(now, 1) },
  { title: 'GeneStar Biotech reports promising trial signals.', description: "Early response data improved confidence in the company's lead program.", ticker: 'GNST', affectedSector: null, impactDirection: 'positive', impactStrength: 0.69, createdAt: subHours(now, 8), expiresAt: addDays(now, 3) },
  { title: 'CloudRoute Express expands overnight parcel coverage.', description: 'New urban micro-hubs are expected to improve delivery density and margins.', ticker: 'CLRT', affectedSector: null, impactDirection: 'positive', impactStrength: 0.44, createdAt: subHours(now, 3), expiresAt: addDays(now, 2) },
  { title: 'Healthcare sentiment steadies after defensive rotation returns.', description: 'Investors rotated into healthcare names as they sought more resilient earnings profiles.', ticker: null, affectedSector: 'Healthcare', impactDirection: 'positive', impactStrength: 0.35, createdAt: subHours(now, 7), expiresAt: addDays(now, 2) },
  { title: 'VirtualRealm VR faces component bottlenecks ahead of launch.', description: 'Supply chain friction may delay key hardware shipments.', ticker: 'VRLM', affectedSector: null, impactDirection: 'negative', impactStrength: 0.56, createdAt: subHours(now, 4), expiresAt: addDays(now, 1) },
  { title: 'Logistics operators benefit from smoother port throughput.', description: 'Improved routing and fewer customs delays support steadier delivery performance.', ticker: null, affectedSector: 'Logistics', impactDirection: 'positive', impactStrength: 0.37, createdAt: subHours(now, 6), expiresAt: addDays(now, 2) },
]

export const mockNews: NewsRecord[] = newsBlueprints.map(({ title, description, ticker, affectedSector, impactDirection, impactStrength, createdAt, expiresAt }, index) => {
  const company = ticker ? mockCompanies.find((item) => item.ticker === ticker)! : null
  return {
    id: `news-${index + 1}`,
    title,
    description,
    affectedCompanyId: company?.id ?? null,
    affectedSector: affectedSector ?? null,
    impactDirection,
    impactStrength,
    createdAt: createdAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
    company,
  }
})

export const mockLeaderboard: LeaderboardEntry[] = [
  { id: 'lb-1', username: 'quantqueen', displayName: 'Quant Queen', rank: 1, portfolioValue: 11894.55, returnPct: 18.9455, xp: 2120, level: 5 },
  { id: 'lb-2', username: 'sectorsage', displayName: 'Sector Sage', rank: 2, portfolioValue: 11583.1, returnPct: 15.831, xp: 1980, level: 5 },
  { id: 'lb-3', username: 'questpilot', displayName: 'Quest Pilot', rank: 3, portfolioValue: 11297.2, returnPct: 12.972, xp: 1860, level: 5 },
  { id: 'lb-4', username: 'chartchaser', displayName: 'Chart Chaser', rank: 4, portfolioValue: 11022.44, returnPct: 10.2244, xp: 1740, level: 5 },
  { id: 'lb-5', username: 'riskwarden', displayName: 'Risk Warden', rank: 5, portfolioValue: 10841.13, returnPct: 8.4113, xp: 1630, level: 5 },
  { id: 'lb-6', username: 'newsninja', displayName: 'News Ninja', rank: 6, portfolioValue: 10677.04, returnPct: 6.7704, xp: 1525, level: 4 },
  { id: 'lb-7', username: 'steadyalpha', displayName: 'Steady Alpha', rank: 7, portfolioValue: 10498.88, returnPct: 4.9888, xp: 1480, level: 4 },
  { id: 'lb-8', username: 'macrohawk', displayName: 'Macro Hawk', rank: 8, portfolioValue: 10316.77, returnPct: 3.1677, xp: 1390, level: 4 },
].map(({ id, username, displayName, rank, portfolioValue, returnPct, xp, level }) => ({
  id,
  profileId: `leader-${username}`,
  seasonId: mockSeason.id,
  rank,
  portfolioValue,
  returnPct,
  snapshotAt: now.toISOString(),
  profile: {
    id: username === 'questpilot' ? mockProfile.id : `profile-${username}`,
    username,
    displayName,
    avatarUrl: null,
    xp,
    level,
  },
}))
