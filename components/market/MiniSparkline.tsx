'use client'

import { Area, AreaChart } from 'recharts'

const SPARKLINE_WIDTH = 112
const SPARKLINE_HEIGHT = 56

export function MiniSparkline({
  data,
  positive,
}: {
  data: { price: number }[]
  positive: boolean
}) {
  return (
    <div className="shrink-0">
      <AreaChart width={SPARKLINE_WIDTH} height={SPARKLINE_HEIGHT} data={data}>
        <Area
          type="monotone"
          dataKey="price"
          stroke={positive ? '#34d399' : '#fb7185'}
          fill={positive ? 'rgba(52, 211, 153, 0.18)' : 'rgba(251, 113, 133, 0.18)'}
          strokeWidth={2}
        />
      </AreaChart>
    </div>
  )
}
