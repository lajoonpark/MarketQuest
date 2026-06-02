import { prisma } from '@/lib/prisma'
import { Decimal } from '@prisma/client/runtime/library'

const MARKET_VOLATILITY = 0.002
const SECTOR_TRENDS: Record<string, number> = {
  Technology: 0.001,
  'Food & Retail': 0.0005,
  Energy: -0.0003,
  Healthcare: 0.0008,
  Entertainment: 0.0006,
  Logistics: 0.0002,
}

export async function simulatePriceUpdate() {
  const companies = await prisma.company.findMany()
  const activeNews = await prisma.marketNews.findMany({
    where: { expiresAt: { gte: new Date() } },
  })

  const marketMove = (Math.random() - 0.5) * MARKET_VOLATILITY * 2

  for (const company of companies) {
    const sectorMove = SECTOR_TRENDS[company.sector] ?? 0
    const volatility = Number(company.volatility)
    const sentiment = Number(company.sentimentScore)
    const randomNoise = (Math.random() - 0.5) * volatility * 2

    let eventImpact = 0
    for (const news of activeNews) {
      if (
        news.affectedCompanyId === company.id ||
        news.affectedSector === company.sector ||
        (!news.affectedCompanyId && !news.affectedSector)
      ) {
        const direction =
          news.impactDirection === 'positive'
            ? 1
            : news.impactDirection === 'negative'
              ? -1
              : 0
        eventImpact += direction * Number(news.impactStrength) * 0.01
      }
    }

    const sentimentEffect = (sentiment - 0.5) * 0.001
    const totalChange = marketMove + sectorMove + eventImpact + randomNoise + sentimentEffect
    const oldPrice = Number(company.currentPrice)
    let newPrice = oldPrice * (1 + totalChange)
    newPrice = Math.max(1, newPrice)
    newPrice = Math.round(newPrice * 100) / 100

    await prisma.$transaction([
      prisma.company.update({
        where: { id: company.id },
        data: {
          previousPrice: company.currentPrice,
          currentPrice: new Decimal(newPrice),
          updatedAt: new Date(),
        },
      }),
      prisma.companyPriceHistory.create({
        data: {
          companyId: company.id,
          price: new Decimal(newPrice),
        },
      }),
    ])
  }
}
