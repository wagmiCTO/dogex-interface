import TradingViewWidget from '@/components/chart/chart'
import TradeFormWrapper from '@/components/trade-form/trade-form-wrapper'

export default function Home() {
  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <div className="mb-4">
        <TradingViewWidget />
      </div>
      <TradeFormWrapper />
    </div>
  )
}
