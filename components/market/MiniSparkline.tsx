'use client'

import { Area, AreaChart, ResponsiveContainer } from 'recharts'

export function MiniSparkline({
  data,
  positive,
}: {
  data: { price: number }[]
  positive: boolean
}) {
  return (
    <div className="h-14 w-28">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <Area
            type="monotone"
            dataKey="price"
            stroke={positive ? '#34d399' : '#fb7185'}
            fill={positive ? 'rgba(52, 211, 153, 0.18)' : 'rgba(251, 113, 133, 0.18)'}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
