import type { Address } from 'viem'
import { arbitrum } from 'viem/chains'

export const CONTRACTS: Record<number, { [key: string]: Address }> = {
  [arbitrum.id]: {
    // arbitrum mainnet
    Vault: '0x489ee077994B6658eAfA855C308275EAd8097C4A',
    Router: '0xaBBc5F99639c9B6bCb58544ddf04EFA6802F4064',
    VaultReader: '0xfebB9f4CAC4cD523598fE1C5771181440143F24A',
    Reader: '0x2b43c90D1B727cEe1Df34925bcd5Ace52Ec37694',
    GlpManager: '0x3963FfC9dff443c2A94f21b129D429891E32ec18',
    RewardRouter: '0x5E4766F932ce00aA4a1A82d3Da85adf15C5694A1',
    GlpRewardRouter: '0xB95DB5B167D75e6d04227CfFFA61069348d271F5',
    RewardReader: '0x8BFb8e82Ee4569aee78D03235ff465Bd436D40E0',
    GovToken: '0x2A29D3a792000750807cc401806d6fd539928481',
    NATIVE_TOKEN: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    GLP: '0x4277f8F2c384827B5273592FF7CeBd9f2C1ac258',
    GMX: '0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a',
    ES_GMX: '0xf42Ae1D54fd613C9bb14810b0588FaAa09a426cA',
    BN_GMX: '0x35247165119B69A40edD5304969560D0ef486921',
    USDG: '0x45096e7aA921f27590f8F19e457794EB09678141',
    ES_GMX_IOU: '0x6260101218eC4cCfFF1b778936C6f2400f95A954',
    StakedGmxTracker: '0x908C4D94D34924765f1eDc22A1DD098397c59dD4',
    BonusGmxTracker: '0x4d268a7d4C16ceB5a606c173Bd974984343fea13',
    FeeGmxTracker: '0xd2D1162512F927a7e282Ef43a362659E4F2a728F',
    StakedGlpTracker: '0x1aDDD80E6039594eE970E5872D247bf0414C8903',
    FeeGlpTracker: '0x4e971a87900b931fF39d1Aad67697F49835400b6',
    ExtendedGmxTracker: '0x0755D33e45eD2B874c9ebF5B279023c8Bd1e5E93',

    StakedGmxDistributor: '0x23208B91A98c7C1CD9FE63085BFf68311494F193',
    StakedGlpDistributor: '0x60519b48ec4183a61ca2B8e37869E675FD203b34',

    GmxVester: '0x199070DDfd1CFb69173aa2F7e20906F26B363004',
    GlpVester: '0xA75287d2f8b217273E7FCD7E86eF07D33972042E',
    AffiliateVester: '0x7c100c0F55A15221A4c1C5a25Db8C98A81df49B2',

    OrderBook: '0x09f77E8A13De9a35a7231028187e9fD5DB8a2ACB',
    OrderExecutor: '0x7257ac5D0a0aaC04AA7bA2AC0A6Eb742E332c3fB',
    OrderBookReader: '0xa27C20A7CF0e1C68C0460706bB674f98F362Bc21',

    PositionRouter: '0xb87a436B93fFE9D75c5cFA7bAcFff96430b09868',
    PositionManager: '0x75E42e6f01baf1D6022bEa862A28774a9f8a4A0C',

    UniswapGmxEthPool: '0x80A9ae39310abf666A87C743d6ebBD0E8C42158E',
    ReferralStorage: '0xe6fab3f0c7199b0d34d7fbe83394fc0e0d06e99d',
    ReferralReader: '0x8Aa382760BCdCe8644C33e6C2D52f6304A76F5c8',
    Timelock: '0xaa50bD556CE0Fe61D4A57718BA43177a3aB6A597',

    // Synthetics
    DataStore: '0xFD70de6b91282D8017aA4E741e9Ae325CAb992d8',
    EventEmitter: '0xC8ee91A54287DB53897056e12D9819156D3822Fb',
    SubaccountRouter: '0xa329221a77BE08485f59310b873b14815c82E10D',
    ExchangeRouter: '0x602b805EedddBbD9ddff44A7dcBD46cb07849685',
    DepositVault: '0xF89e77e8Dc11691C9e8757e84aaFbCD8A67d7A55',
    WithdrawalVault: '0x0628D46b5D145f183AdB6Ef1f2c97eD1C4701C55',
    OrderVault: '0x31eF83a530Fde1B38EE9A18093A333D8Bbbc40D5',
    ShiftVault: '0xfe99609C4AA83ff6816b64563Bdffd7fa68753Ab',
    SyntheticsReader: '0xcF2845Ab3866842A6b51Fb6a551b92dF58333574',
    SyntheticsRouter: '0x7452c558d45f8afC8c83dAe62C3f8A5BE19c71f6',

    GlvReader: '0x6a9505D0B44cFA863d9281EA5B0b34cB36243b45',
    GlvRouter: '0x994c598e3b0661bb805d53c6fa6b4504b23b68dd',
    GlvVault: '0x393053B58f9678C9c28c2cE941fF6cac49C3F8f9',

    GelatoRelayRouter: '0x9EB239eDf4c6f4c4fC9d30ea2017F8716d049C8D',
    SubaccountGelatoRelayRouter: '0x5F345B765d5856bC0843cEE8bE234b575eC77DBC',

    ExternalHandler: '0x389CEf541397e872dC04421f166B5Bc2E0b374a5',
    OpenOceanRouter: '0x6352a56caadC4F1E25CD6c75970Fa768A3304e64',

    ChainlinkPriceFeedProvider: '0x527FB0bCfF63C47761039bB386cFE181A92a4701',

    Multicall: '0x842ec2c7d803033edf55e478f461fc547bc54eb2',
    ArbitrumNodeInterface: '0x00000000000000000000000000000000000000C8',
  },
}

export function getContract(chainId: number, name: string): Address {
  if (!CONTRACTS[chainId]) {
    throw new Error(`Unknown chainId ${chainId}`)
  }

  if (!CONTRACTS[chainId][name]) {
    throw new Error(`Unknown contract "${name}" for chainId ${chainId}`)
  }

  return CONTRACTS[chainId][name]
}
