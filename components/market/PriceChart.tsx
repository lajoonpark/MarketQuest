'use client'

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { formatCurrency } from '@/lib/utils'

export function PriceChart({
  data,
}: {
  data: { recordedAt: string; price: number }[]
}) {
  const points = data.map((point) => ({
    ...point,
    label: new Date(point.recordedAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
  }))

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points}>
          <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 12 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
          <Tooltip
            contentStyle={{ backgroundColor: '#020617', border: '1px solid #1f2937', borderRadius: 12 }}
            formatter={(value) => formatCurrency(Number(value ?? 0))}
          />
          <Line type="monotone" dataKey="price" stroke="#818cf8" strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
