'use server'

import { Decimal } from '@prisma/client/runtime/library'

import { prisma } from '@/lib/prisma'
import { calculateLevel } from '@/lib/utils'

import { updateQuestProgress } from '@/app/actions/quests'

async function unlockAchievement(profileId: string, title: string) {
  try {
    const achievement = await prisma.achievement.findFirst({ where: { title } })
    if (!achievement) return

    await prisma.userAchievement.upsert({
      where: {
        profileId_achievementId: {
          profileId,
          achievementId: achievement.id,
        },
      },
      update: {},
      create: {
        profileId,
        achievementId: achievement.id,
      },
    })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[unlockAchievement] failed to unlock achievement:', error)
    }
  }
}

export async function executeTrade(
  portfolioId: string,
  companyId: string,
  type: 'buy' | 'sell',
  shares: number
) {
  if (!portfolioId || !companyId || !['buy', 'sell'].includes(type)) {
    return { success: false, message: 'Invalid trade request.' }
  }
  if (!Number.isFinite(shares) || shares <= 0) {
    return { success: false, message: 'Shares must be greater than zero.' }
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const portfolio = await tx.portfolio.findUnique({
        where: { id: portfolioId },
        include: { profile: true },
      })
      const company = await tx.company.findUnique({ where: { id: companyId } })
      if (!portfolio || !company) {
        throw new Error('Portfolio or company not found.')
      }

      const price = new Decimal(company.currentPrice)
      const shareAmount = new Decimal(shares)
      const total = price.mul(shareAmount)
      const holding = await tx.holding.findUnique({
        where: { portfolioId_companyId: { portfolioId, companyId } },
      })

      if (type === 'buy') {
        if (portfolio.cash.lt(total)) {
          throw new Error('Not enough cash available for this trade.')
        }

        await tx.portfolio.update({
          where: { id: portfolioId },
          data: { cash: { decrement: total } },
        })

        if (holding) {
          const nextShares = holding.shares.add(shareAmount)
          const nextInvested = holding.totalInvested.add(total)
          const avgBuyPrice = nextInvested.div(nextShares)
          await tx.holding.update({
            where: { id: holding.id },
            data: {
              shares: nextShares,
              totalInvested: nextInvested,
              avgBuyPrice,
            },
          })
        } else {
          await tx.holding.create({
            data: {
              portfolioId,
              companyId,
              shares: shareAmount,
              avgBuyPrice: price,
              totalInvested: total,
            },
          })
        }
      }

      if (type === 'sell') {
        if (!holding || holding.shares.lt(shareAmount)) {
          throw new Error('You do not own enough shares to sell.')
        }

        const costBasis = holding.avgBuyPrice.mul(shareAmount)
        const realized = total.sub(costBasis)
        const remainingShares = holding.shares.sub(shareAmount)
        const remainingInvested = Decimal.max(new Decimal(0), holding.totalInvested.sub(costBasis))

        await tx.portfolio.update({
          where: { id: portfolioId },
          data: { cash: { increment: total } },
        })

        if (remainingShares.lte(0)) {
          await tx.holding.delete({ where: { id: holding.id } })
        } else {
          await tx.holding.update({
            where: { id: holding.id },
            data: {
              shares: remainingShares,
              totalInvested: remainingInvested,
              realizedPnl: holding.realizedPnl.add(realized),
            },
          })
        }
      }

      await tx.trade.create({
        data: {
          portfolioId,
          companyId,
          type,
          shares: shareAmount,
          price,
          total,
        },
      })

      const nextXp = portfolio.profile.xp + 35
      await tx.profile.update({
        where: { id: portfolio.profileId },
        data: { xp: { increment: 35 }, level: calculateLevel(nextXp) },
      })

      return { profileId: portfolio.profileId }
    })

    await Promise.all([
      updateQuestProgress(result.profileId, 'trade_count', 1),
      type === 'buy' ? updateQuestProgress(result.profileId, 'buy_count', 1) : Promise.resolve(),
      unlockAchievement(result.profileId, 'First Trade'),
    ])

    return { success: true, message: `Successfully ${type === 'buy' ? 'bought' : 'sold'} ${shares.toFixed(2)} shares.` }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to execute trade.'
    if (message.includes('connect') || message.includes('ECONNREFUSED')) {
      return { success: true, message: 'Trade simulated successfully in demo mode.' }
    }
    return { success: false, message }
  }
}
