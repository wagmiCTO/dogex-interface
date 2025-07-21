'use client'

import { memo, useEffect, useRef } from 'react'

function TradingViewWidget() {
  const container = useRef(null)

  useEffect(() => {
    const script = document.createElement('script')
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = `
        {
          "allow_symbol_change": true,
          "calendar": false,
          "details": false,
          "hide_side_toolbar": true,
          "hide_top_toolbar": false,
          "hide_legend": false,
          "hide_volume": false,
          "hotlist": false,
          "interval": "1",
          "locale": "en",
          "save_image": true,
          "style": "1",
          "symbol": "BINANCE:DOGEUSDT",
          "theme": "dark",
          "timezone": "Etc/UTC",
          "backgroundColor": "#0F0F0F",
          "gridColor": "rgba(242, 242, 242, 0.06)",
          "watchlist": [],
          "withdateranges": false,
          "compareSymbols": [],
          "studies": [],
          "width": 890,
          "height": 500
        }`
    // @ts-ignore
    container.current.appendChild(script)
  }, [])

  return (
    <div className="tradingview-widget-container" ref={container}>
      <div className="tradingview-widget-container__widget"></div>
    </div>
  )
}

export default memo(TradingViewWidget)
