import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

export function calculateLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1
}

export function xpForNextLevel(level: number): number {
  return level * level * 100
}

export function xpProgress(xp: number): number {
  const level = calculateLevel(xp)
  const currentLevelXp = (level - 1) * (level - 1) * 100
  const nextLevelXp = level * level * 100
  return ((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100
}

export function getPriceChangePercent(current: number, previous: number) {
  if (!previous) return 0
  return ((current - previous) / previous) * 100
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}
