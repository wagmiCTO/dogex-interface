# Trade Page Documentation

## Overview

The Trade Page is the main interface for users to interact with the DOGEX protocol, allowing them to open leveraged positions on DOGE price movements. The page consists of two main components: the Trade Form for opening new positions and the Vibe Trader for AI-powered trading insights.

## Component Architecture

### Main Components

```
TradeFormWrapper
├── TradeForm
│   ├── CurrentPosition (when position exists)
│   └── New Position Form
│       ├── PayAmount
│       ├── LeverageSlider
│       ├── PositionInfo
│       └── TradeDirectionButtons
│           ├── UsdcApprovalButton
│           └── TradeButtons
└── VibeTrader
    ├── ActivePositionView
    └── NonActivePositionView
```

## Core Features

### 1. Position Management
- **New Position Creation**: Users can open LONG or SHORT positions on DOGE
- **Active Position Monitoring**: Real-time P&L tracking and position details
- **Position Closure**: One-click position closing functionality

### 2. Leverage Trading
- **Leverage Range**: 10x to 100x leverage options
- **Risk Management**: Visual risk indicators based on leverage level
- **Dynamic Calculations**: Real-time position size and profit potential updates

### 3. Payment System
- **USDC Collateral**: All positions use USDC as collateral
- **Balance Checking**: Real-time USDC balance monitoring
- **Approval Flow**: Automatic token approval handling

## Component Details

### TradeForm (`trade-form.tsx`)

Main container that renders different views based on position status:
- Shows `CurrentPosition` when user has an active position
- Shows new position form when no active position exists

**Props:**
- `positionData: ContractPosition | undefined` - Current user position data

### PayAmount (`pay-amount.tsx`)

Handles USDC amount input for position collateral:
- **Input Range**: 1-10,000 USDC
- **Balance Display**: Shows current USDC balance
- **Max Button**: Quick selection of maximum available balance
- **Validation**: Ensures amount is within valid range

**Features:**
- Real-time balance fetching via `useReadContract`
- Input validation with min/max constraints
- One-click max amount selection

### LeverageSlider (`leverage-slider.tsx`)

Interactive slider for selecting position leverage:
- **Range**: 10x to 100x leverage
- **Risk Indicators**: Color-coded risk levels
  - Green (10x): Low Risk
  - Yellow (11-30x): Medium Risk
  - Orange (31-50x): High Risk
  - Red (51-100x): Extreme/Maximum Risk

**State Management:**
- Uses Zustand store for leverage state
- Dynamic color changes based on risk level

### PositionInfo (`position-info.tsx`)

Displays calculated position metrics:
- **Position Size**: Total position value (collateral × leverage)
- **Potential Profit**: Estimated profit range
- **Risk Level**: Calculated risk assessment

**Calculations:**
- Position size = Pay amount × Leverage
- Risk level based on leverage multiplier

### TradeDirectionButtons (`trade-direction-buttons.tsx`)

Manages the trading flow and button states:

**Button States:**
1. **Connect Wallet**: When no wallet connected
2. **Mint USDC**: When USDC balance < 100
3. **Approve USDC**: When allowance insufficient
4. **Trade Buttons**: When ready to trade

**Features:**
- Automatic flow management
- Balance validation
- Approval checking
- Error handling

### CurrentPosition (`current-position.tsx`)

Displays active position details when user has an open position:

**Information Displayed:**
- **P&L**: Profit/Loss with percentage
- **Entry Price**: Position entry price
- **Liquidation Price**: Calculated liquidation threshold
- **Position Size**: Total position value
- **Paid Amount**: Collateral amount
- **Leverage**: Applied leverage multiplier
- **Direction**: LONG/SHORT indicator

**Actions:**
- **Close Position**: One-click position closure
- **Real-time Updates**: Live P&L calculation

### VibeTrader (`vibe-trader.tsx`)

AI-powered trading companion that provides:
- **Market Analysis**: AI-driven insights
- **Position Recommendations**: Trading suggestions
- **Visual Interface**: Animated character interaction

**Views:**
- `ActivePositionView`: When user has position
- `NonActivePositionView`: When no position exists

## State Management

### Zustand Store (`@/store/store`)

Manages global trading state:
```typescript
{
  payAmount: number,        // USDC amount to pay
  leverage: number,         // Selected leverage (10-100)
  positionSize: number,     // Calculated position size
  potentialProfit: {        // Estimated profit range
    min: number,
    max: number
  }
}
```

### Actions:
- `setPayAmount(amount: number)`
- `setLeverage(leverage: number)`
- Auto-calculated derived values

## Smart Contract Integration

### Contract Interactions

**DOGEX Contract:**
- `getPosition(address)`: Fetch user position
- `increasePosition(collateral, size, isLong)`: Open position
- `closePosition()`: Close position

**USDC Contract:**
- `balanceOf(address)`: Get USDC balance
- `allowance(owner, spender)`: Check approval
- `approve(spender, amount)`: Approve spending

### Transaction Flow

1. **Balance Check**: Verify sufficient USDC
2. **Approval**: Ensure contract can spend USDC
3. **Position Opening**: Execute trade transaction
4. **Monitoring**: Real-time position tracking
5. **Closure**: Close position when desired

## Validation & Error Handling

### Input Validation
- **Pay Amount**: 1-10,000 USDC range
- **Balance Requirements**: Minimum 100 USDC
- **Leverage Limits**: 10x-100x range

### Error States
- **Insufficient Balance**: Redirects to mint page
- **Approval Required**: Shows approval button
- **Transaction Failures**: Error messages and retry options

### User Feedback
- **Loading States**: Transaction pending indicators
- **Success Notifications**: Confirmation messages
- **Risk Warnings**: High leverage alerts

## Responsive Design

### Layout
- **Desktop**: Side-by-side trade form and vibe trader
- **Mobile**: Stacked vertical layout
- **Minimum Width**: 320px mobile, 420px desktop

### Styling
- **Theme**: Dark gray background with accent colors
- **Colors**: 
  - Green (#3DD598): Profits, low risk
  - Red (#F65E5D): Losses, high risk
  - Blue: Interactive elements
- **Typography**: Bold numbers, readable text hierarchy

## Technical Dependencies

### External Libraries
- **Wagmi**: Web3 React hooks for Ethereum interactions
- **Viem**: Ethereum library for formatting and parsing
- **React**: Component framework
- **Zustand**: State management
- **Tailwind CSS**: Styling framework

### Internal Dependencies
- `@/components/ui/*`: Shared UI components
- `@/lib/abis/*`: Contract ABIs
- `@/lib/contracts`: Contract address management
- `@/lib/types`: TypeScript type definitions
- `@/lib/utils`: Utility functions

## Configuration

### Constants
```typescript
const USDC_CONTRACT_ADDRESS = '0x7e8aD9892265a5A665062b5C3D387aF301A673b6'
const MIN_LEVERAGE = 10
const MAX_LEVERAGE = 100
const MIN_BALANCE_REQUIRED = 100
```

### Contract Addresses
- Managed via `getContract(chainId, 'Dogex')`
- Multi-chain support structure
- Environment-specific deployments

## Performance Optimizations

### Real-time Updates
- **Position Polling**: 500ms refresh interval
- **Balance Caching**: Wagmi query caching
- **Conditional Rendering**: Efficient re-renders

### User Experience
- **Instant Feedback**: Immediate UI updates
- **Progressive Loading**: Staged data loading
- **Error Recovery**: Automatic retry mechanisms

## Security Considerations

### Input Sanitization
- Numerical input validation
- Range boundary enforcement
- Type safety with TypeScript

### Contract Security
- Approval amount limits
- Transaction validation
- Slippage protection

## Development Notes

### Testing Environment
- Designed for testnet deployment
- Mock data support for development
- Comprehensive error simulation

### Future Enhancements
- **Multiple Assets**: Beyond DOGE trading
- **Advanced Orders**: Stop-loss, take-profit
- **Portfolio View**: Multi-position management
- **Analytics**: Trading history and performance
- **Mobile App**: Native mobile experience

## Related Documentation
- [Mint Page](./mint-page.md)
- [Wallet Integration](./wallet-integration.md)
- [Smart Contracts](./smart-contracts.md)
- [API Reference](./api-reference.md)
