import TradingViewWidget from "@/components/chart/chart";
import TradeForm from "@/components/trade-form/trade-form";
import VibeTrader from "@/components/vibe-trader/vibe-trader";

export default function Home() {
	return (
		<div className="flex flex-1 flex-col justify-center items-center">
			<div className="mb-4">
				<TradingViewWidget />
			</div>
			<div className="flex flex-row gap-4">
				<TradeForm />
				<VibeTrader />
			</div>
		</div>
	);
}
