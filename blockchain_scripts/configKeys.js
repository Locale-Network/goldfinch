const CONFIG_KEYS = {
  // Numbers
  TransactionLimit: 0,
  TotalFundsLimit: 1,
  MaxUnderwriterLimit: 2,
  ReserveDenominator: 3,
  WithdrawFeeDenominator: 4,
  LatenessGracePeriodInDays: 5,
  LatenessMaxDays: 6,
  DrawdownPeriodInSeconds: 7,
  // Addresses
  Pool: 0,
  CreditLineImplementation: 1,
  CreditLineFactory: 2,
  CreditDesk: 3,
  Fidu: 4,
  USDC: 5,
  TreasuryReserve: 6,
  ProtocolAdmin: 7,
  OneInch: 8,
  TrustedForwarder: 9,
  CUSDCContract: 10,
  GoldfinchConfig: 11,
  PoolTokens: 12,
  TranchedPoolImplementation: 13,
  SeniorFund: 14,
  SeniorFundStrategy: 15,
  MigratedTranchedPoolImplementation: 16,
  CreditLineFactoryV2: 17,
  BorrowerImplementation: 18,
}

module.exports = {CONFIG_KEYS}
