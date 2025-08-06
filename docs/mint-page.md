# Mint Page Documentation

## Overview

The Mint page (`/mint`) provides a user interface for minting testnet USDC tokens. This page is designed for testing and development purposes, allowing users to obtain USDC tokens needed for interacting with the DogEx trading platform.

## Location

- **Route**: `/mint`
- **File**: `src/app/mint/page.tsx`
- **Component**: `src/components/mint/mint-component.tsx`

## Features

### 1. USDC Token Minting
- **Mint Amount**: Fixed at 1,000 USDC per transaction
- **Eligibility**: Users can only mint if their current USDC balance is ≤ 100 USDC
- **Contract**: `0x7e8aD9892265a5A665062b5C3D387aF301A673b6` (testnet USDC)

### 2. Balance Display
- Shows current USDC balance in real-time
- Updates automatically after successful minting
- Formatted to 2 decimal places

### 3. Wallet Integration
- Requires wallet connection to function
- Uses Wagmi hooks for blockchain interactions
- Supports MetaMask and other Web3 wallets

### 4. Add Token to Wallet
- One-click button to add USDC token to user's wallet
- Automatically configures token details (address, symbol, decimals, icon)
- Provides user feedback on success/failure

## User Interface

### Layout
```
┌─────────────────────────────────────┐
│             Mint USDC               │
├─────────────────────────────────────┤
│ Current USDC Balance                │
│ [Balance] USDC [+Wallet]            │
├─────────────────────────────────────┤
│ Mint Amount                         │
│ 1,000 USDC [+Wallet]                │
├─────────────────────────────────────┤
│ [Success/Error Messages]            │
├─────────────────────────────────────┤
│        [Mint 1,000 USDC]            │
├─────────────────────────────────────┤
│ Transaction Hash: [hash]            │
├─────────────────────────────────────┤
│ • Usage guidelines                  │
│ • Testnet faucet link              │
└─────────────────────────────────────┘
```

### Button States
- **Not Connected**: "Connect Wallet"
- **Balance > 100 USDC**: "Cannot mint (Balance > 100 USDC)"
- **Processing**: "Minting..." or "Confirming..."
- **Ready**: "Mint 1,000 USDC"

## Technical Implementation

### Key Components

#### MintComponent (`mint-component.tsx`)
- Main minting interface
- Handles balance checking and minting logic
- Manages transaction states and user feedback

#### AddTokenButton (`add-token-button.tsx`)
- Utility button for adding USDC to wallet
- Uses `wallet_watchAsset` method
- Provides visual feedback during operation

### Smart Contract Integration
- **Contract Address**: `0x7e8aD9892265a5A665062b5C3D387aF301A673b6`
- **ABI**: Imported from `@/lib/abis/usdc`
- **Key Functions**:
  - `balanceOf(address)`: Check user's USDC balance
  - `decimals()`: Get token decimal places
  - `mint(address, amount)`: Mint tokens to address

### State Management
- **Loading States**: Tracks minting and confirmation progress
- **Error Handling**: Displays user-friendly error messages
- **Success Feedback**: Shows confirmation messages with auto-dismiss
- **Balance Updates**: Automatically refetches after successful mint

## User Flow

1. **Connect Wallet**: User connects their Web3 wallet
2. **Check Eligibility**: System checks if balance ≤ 100 USDC
3. **Mint Tokens**: User clicks mint button if eligible
4. **Transaction**: Smart contract mint function is called
5. **Confirmation**: Wait for blockchain confirmation
6. **Update Balance**: Interface updates with new balance
7. **Add to Wallet**: Optional step to add token to wallet

## Error Handling

### Common Errors
- **Wallet Not Connected**: "Please connect your wallet"
- **Insufficient Eligibility**: "You cannot mint USDC if you have more than 100 USDC"
- **Transaction Failed**: Custom error messages from blockchain
- **Token Addition Failed**: "Failed to add token to wallet"

### Error Display
- Red-bordered alert boxes for errors
- Auto-dismiss after 3 seconds
- Clear, user-friendly messages

## Dependencies

### External Libraries
- **Wagmi**: Web3 React hooks for Ethereum
- **Viem**: Ethereum library for formatting and parsing
- **React**: Component framework

### Internal Dependencies
- `@/components/ui/button`: Styled button component
- `@/lib/abis/usdc`: USDC contract ABI
- `@/lib/constant`: Token configuration constants

## Configuration

### Constants
```typescript
const USDC_CONTRACT_ADDRESS = '0x7e8aD9892265a5A665062b5C3D387aF301A673b6'
const MINT_AMOUNT = 1000
```

### Styling
- Uses Tailwind CSS for styling
- Dark theme with gray/blue color scheme
- Responsive design for mobile and desktop

## Development Notes

### Testing
- Designed for testnet environment
- Provides link to testnet ETH faucet for gas fees
- Uses testnet USDC contract

### Limitations
- Fixed mint amount (1,000 USDC)
- Balance limit of 100 USDC for eligibility
- Single token support (USDC only)

### Future Enhancements
- Variable mint amounts
- Support for multiple tokens
- Enhanced transaction history
- Improved error recovery

## Related Documentation
- [Trading Interface](./trade-form.md)
- [Wallet Integration](./wallet-integration.md)
- [Smart Contracts](./smart-contracts.md)
