import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const headerSecret = request.headers.get('x-api-secret')
  const expectedSecret =
    process.env.SIMULATION_API_SECRET ??
    process.env.SUPABASE_SECRET_KEY ??
    process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!expectedSecret || headerSecret !== expectedSecret) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { simulatePriceUpdate } = await import('@/lib/simulation/priceEngine')
    await simulatePriceUpdate()
    return NextResponse.json({ success: true, message: 'Simulation complete.' })
  } catch {
    return NextResponse.json({ success: false, message: 'Simulation failed.' }, { status: 500 })
  }
}
