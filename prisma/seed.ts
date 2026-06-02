import { Prisma, PrismaClient } from '@prisma/client'
import { addDays, subDays, subHours } from 'date-fns'

const prisma = new PrismaClient()
const now = new Date('2025-01-15T16:00:00.000Z')

const sectorPalettes: Record<string, string[]> = {
  Technology: ['#2563eb', '#4338ca', '#7c3aed', '#1d4ed8', '#5b21b6'],
  'Food & Retail': ['#16a34a', '#f97316', '#65a30d', '#ea580c', '#22c55e'],
  Energy: ['#eab308', '#f59e0b', '#f97316', '#d97706', '#facc15'],
  Healthcare: ['#0f766e', '#059669', '#14b8a6', '#10b981', '#0d9488'],
  Entertainment: ['#db2777', '#9333ea', '#c026d3', '#7c3aed', '#ec4899'],
  Logistics: ['#475569', '#2563eb', '#334155', '#0f172a', '#1d4ed8'],
}

const shapes = ['rounded', 'circle', 'hex', 'diamond', 'shield'] as const

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

const questSeeds = [
  ['Check the opening bell', 'Log in today and keep your streak alive.', 'login', 1, 40, 'Flame'],
  ['Place a market move', 'Execute one trade today.', 'trade_count', 1, 80, 'CandlestickChart'],
  ['Open a new position', 'Buy your first stock of the day.', 'buy_count', 1, 60, 'TrendingUp'],
  ['Lock in green', 'Sell a position for profit.', 'profit_sell', 1, 120, 'BadgeDollarSign'],
  ['Research sprint', 'View 3 company pages.', 'company_views', 3, 50, 'Search'],
  ['Scout the market', 'Add 3 companies to your watchlist.', 'watchlist_add', 3, 50, 'Eye'],
  ['Sector spread', 'Hold positions in 3 sectors.', 'diversify_sectors', 3, 120, 'PieChart'],
  ['Read the tape', 'Read 3 market news items.', 'news_reads', 3, 55, 'Newspaper'],
  ['Sharpen your edge', 'Complete one lesson.', 'lessons_completed', 1, 90, 'GraduationCap'],
  ['Show consistency', 'Reach a 3-day login streak.', 'streak_days', 3, 110, 'Award'],
] as const

const achievementSeeds = [
  ['First Trade', 'Complete your very first fictional trade.', 'Sparkles', 100],
  ['First Profit', 'Close a trade in the green.', 'Gem', 120],
  ['First Loss', 'Experience a losing trade and learn from it.', 'ShieldAlert', 80],
  ['3-Day Streak', 'Log in three days in a row.', 'Flame', 90],
  ['7-Day Streak', 'Stay active for a full trading week.', 'FlameKindling', 160],
  ['Diversified Investor', 'Own holdings across 3 sectors.', 'Layers3', 140],
  ['Watchlist Builder', 'Track 3 companies.', 'ListChecks', 70],
  ['Market Reader', 'Read 10 news items.', 'BookOpenCheck', 95],
  ['Comeback Trader', 'Recover after a losing day.', 'RefreshCcw', 150],
  ['Long-Term Holder', 'Hold a position for 5 days.', 'Clock3', 110],
] as const

const lessonSeeds = [
  ['What is a stock?', 'what-is-a-stock', 'A stock represents a slice of ownership in a company. In MarketQuest, owning shares means your portfolio rises and falls with each fictional company\'s price moves.', 60, 1],
  ['What is diversification?', 'what-is-diversification', 'Diversification spreads your risk across multiple sectors and companies so a single bad move hurts less.', 70, 2],
  ['What is volatility?', 'what-is-volatility', 'Volatility measures how sharply prices can move. Higher volatility creates bigger upside and deeper drawdowns.', 80, 3],
  ['What is market sentiment?', 'what-is-market-sentiment', 'Sentiment reflects how optimistic or fearful traders feel, often moving prices before fundamentals catch up.', 75, 4],
  ['Why risk management matters', 'why-risk-management-matters', 'Position sizing, cash reserves, and discipline help you survive long enough to capitalize on better setups.', 90, 5],
  ['Investing vs. gambling', 'investing-vs-gambling', 'Investing uses repeatable reasoning and risk controls, while gambling relies on luck without an edge.', 95, 6],
] as const

const newsSeeds = [
  ['Global risk appetite improves as season opens with broad gains.', 'A strong early-week tape is lifting most sectors, boosting trader confidence heading into the next leaderboard snapshot.', null, null, 'positive', 0.42, subHours(now, 10), addDays(now, 1)],
  ['SkyForge Robotics wins a multi-year automation contract.', 'The fictional manufacturer secured a major fulfillment-center rollout, increasing revenue visibility.', 'SKYF', null, 'positive', 0.73, subHours(now, 5), addDays(now, 2)],
  ['Food retail stocks rise after consumer spending surprises higher.', 'Fresh transaction data points to resilient household demand for premium convenience products.', null, 'Food & Retail', 'positive', 0.48, subHours(now, 12), addDays(now, 2)],
  ['PixelPeak Studios delays its flagship expansion pack.', 'The studio cited additional polish time, creating short-term pressure on launch expectations.', 'PXPK', null, 'negative', 0.61, subHours(now, 15), addDays(now, 1)],
  ['Energy names soften after weaker-than-expected demand forecasts.', 'Analysts trimmed near-term power demand expectations for industrial customers.', null, 'Energy', 'negative', 0.51, subHours(now, 18), addDays(now, 1)],
  ['GeneStar Biotech reports promising trial signals.', 'Early response data improved confidence in the company\'s lead program.', 'GNST', null, 'positive', 0.69, subHours(now, 8), addDays(now, 3)],
  ['CloudRoute Express expands overnight parcel coverage.', 'New urban micro-hubs are expected to improve delivery density and margins.', 'CLRT', null, 'positive', 0.44, subHours(now, 3), addDays(now, 2)],
  ['Healthcare sentiment steadies after defensive rotation returns.', 'Investors rotated into healthcare names as they sought more resilient earnings profiles.', null, 'Healthcare', 'positive', 0.35, subHours(now, 7), addDays(now, 2)],
  ['VirtualRealm VR faces component bottlenecks ahead of launch.', 'Supply chain friction may delay key hardware shipments.', 'VRLM', null, 'negative', 0.56, subHours(now, 4), addDays(now, 1)],
  ['Logistics operators benefit from smoother port throughput.', 'Improved routing and fewer customs delays support steadier delivery performance.', null, 'Logistics', 'positive', 0.37, subHours(now, 6), addDays(now, 2)],
] as const

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

async function main() {
  await prisma.$transaction([
    prisma.userLessonProgress.deleteMany(),
    prisma.userAchievement.deleteMany(),
    prisma.userQuest.deleteMany(),
    prisma.trade.deleteMany(),
    prisma.holding.deleteMany(),
    prisma.portfolio.deleteMany(),
    prisma.leaderboardSnapshot.deleteMany(),
    prisma.marketNews.deleteMany(),
    prisma.companyPriceHistory.deleteMany(),
    prisma.lesson.deleteMany(),
    prisma.achievement.deleteMany(),
    prisma.quest.deleteMany(),
    prisma.season.deleteMany(),
    prisma.company.deleteMany(),
    prisma.profile.deleteMany(),
  ])

  const companies = await Promise.all(
    companySeeds.map(async ([name, ticker, sector, currentPrice, description, volatility, growthRating, riskRating, sentimentScore], index) => {
      const previousPrice = Number((currentPrice * (1 - (((index % 7) - 3) * 0.012 + 0.006))).toFixed(2))
      return prisma.company.create({
        data: {
          id: `company-${ticker.toLowerCase()}`,
          name,
          ticker,
          sector,
          description,
          currentPrice: new Prisma.Decimal(currentPrice),
          previousPrice: new Prisma.Decimal(previousPrice),
          volatility: new Prisma.Decimal(volatility),
          growthRating,
          riskRating,
          sentimentScore: new Prisma.Decimal(sentimentScore),
          logoSvg: createLogo(name, sector, index),
          createdAt: subDays(now, 120),
          updatedAt: now,
        },
      })
    })
  )

  const companyMap = Object.fromEntries(companies.map((company) => [company.ticker, company]))

  await prisma.companyPriceHistory.createMany({
    data: companies.flatMap((company, index) =>
      Array.from({ length: 30 }, (_, historyIndex) => {
        const drift = (historyIndex - 20) * 0.0035
        const seasonal = Math.sin((historyIndex + index) / 3.2) * Number(company.volatility) * 1.6
        const price = Number(company.currentPrice) * (1 + drift + seasonal)
        return {
          id: `${company.id}-history-${historyIndex + 1}`,
          companyId: company.id,
          price: new Prisma.Decimal(Number(Math.max(price, 1).toFixed(2))),
          recordedAt: subDays(now, 29 - historyIndex),
        }
      })
    ),
  })

  const season = await prisma.season.create({
    data: {
      id: 'season-winter-rally',
      name: 'Winter Rally Season',
      startDate: subDays(now, 2),
      endDate: addDays(now, 5),
      startingCash: new Prisma.Decimal(10000),
      status: 'active',
      createdAt: subDays(now, 3),
    },
  })

  await prisma.quest.createMany({
    data: questSeeds.map(([title, description, type, target, xpReward, icon], index) => ({
      id: `quest-${index + 1}`,
      title,
      description,
      type,
      target,
      xpReward,
      icon,
    })),
  })

  await prisma.achievement.createMany({
    data: achievementSeeds.map(([title, description, icon, xpReward], index) => ({
      id: `achievement-${index + 1}`,
      title,
      description,
      icon,
      xpReward,
    })),
  })

  await prisma.lesson.createMany({
    data: lessonSeeds.map(([title, slug, content, xpReward, orderIndex], index) => ({
      id: `lesson-${index + 1}`,
      title,
      slug,
      content,
      xpReward,
      orderIndex,
    })),
  })

  await prisma.marketNews.createMany({
    data: newsSeeds.map(([title, description, ticker, affectedSector, impactDirection, impactStrength, createdAt, expiresAt], index) => ({
      id: `news-${index + 1}`,
      title,
      description,
      affectedCompanyId: ticker ? companyMap[ticker].id : null,
      affectedSector,
      impactDirection,
      impactStrength: new Prisma.Decimal(impactStrength),
      createdAt,
      expiresAt,
    })),
  })

  console.log(`Seeded ${companies.length} companies, ${season.name}, 10 quests, 10 achievements, 6 lessons, and 10 news items.`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
