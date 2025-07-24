'use client'

import { useMobile } from '@/hooks/use-mobile'
import { memo, useEffect, useRef, useState } from 'react'

function TradingViewWidget() {
  const container = useRef<HTMLDivElement>(null)
  const widgetId = useRef(
    `tradingview_${Math.random().toString(36).substring(2, 9)}`,
  )
  const isMobile = useMobile()
  const [dimensions, setDimensions] = useState({ width: 890, height: 500 })

  useEffect(() => {
    setDimensions({
      width: isMobile ? 320 : 890,
      height: isMobile ? 400 : 500,
    })
  }, [isMobile])

  useEffect(() => {
    if (!container.current) return

    container.current.innerHTML = ''

    const widgetDiv = document.createElement('div')
    widgetDiv.className = 'tradingview-widget-container__widget'
    widgetDiv.id = widgetId.current
    container.current.appendChild(widgetDiv)

    const script = document.createElement('script')
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = JSON.stringify({
      allow_symbol_change: true,
      calendar: false,
      details: false,
      hide_side_toolbar: true,
      hide_top_toolbar: false,
      hide_legend: false,
      hide_volume: false,
      hotlist: false,
      interval: '1',
      locale: 'en',
      save_image: true,
      style: '1',
      symbol: 'BINANCE:DOGEUSDT',
      theme: 'dark',
      timezone: 'Etc/UTC',
      backgroundColor: '#0F0F0F',
      gridColor: 'rgba(242, 242, 242, 0.06)',
      watchlist: [],
      withdateranges: false,
      compareSymbols: [],
      studies: [],
      width: dimensions.width,
      height: dimensions.height,
      container_id: widgetId.current,
    })

    container.current.appendChild(script)

    return () => {
      if (container.current) {
        container.current.innerHTML = ''
      }
      if (typeof window !== 'undefined' && (window as any).TradingView) {
        try {
          delete (window as any).TradingView.widget
        } catch {}
      }
    }
  }, [dimensions])

  return (
    <div
      className="tradingview-widget-container"
      style={{
        height: `${dimensions.height}px`,
        width: `${dimensions.width}px`,
      }}
    >
      <div ref={container} />
    </div>
  )
}

export default memo(TradingViewWidget)
