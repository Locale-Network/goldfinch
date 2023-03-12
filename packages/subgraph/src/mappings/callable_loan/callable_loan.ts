import {Address} from "@graphprotocol/graph-ts"
import {CallableLoan, PoolToken} from "../../../generated/schema"
import {
  CallableLoan as CallableLoanContract,
  CallRequestSubmitted,
  DepositMade,
  DrawdownMade,
  DrawdownsPaused,
  DrawdownsUnpaused,
  PaymentApplied,
  WithdrawalMade,
} from "../../../generated/templates/CallableLoan/CallableLoan"
import {
  updateTotalInterestCollected,
  updateTotalPrincipalCollected,
  updateTotalReserveCollected,
} from "../../entities/protocol"
import {getOrInitUser} from "../../entities/user"
import {
  estimateCallableLoanPaymentFrequency,
  deleteCallableLoanRepaymentSchedule,
  generateRepaymentScheduleForCallableLoan,
  updatePoolTokensRedeemable,
} from "./helpers"

function getCallableLoan(address: Address): CallableLoan {
  return assert(CallableLoan.load(address.toHexString()))
}

export function handleDepositMade(event: DepositMade): void {
  const callableLoan = getCallableLoan(event.address)
  const callableLoanContract = CallableLoanContract.bind(event.address)
  callableLoan.totalPrincipalPaid = callableLoanContract.totalPrincipalPaid()
  callableLoan.totalDeposited = callableLoan.totalDeposited.plus(event.params.amount)
  const user = getOrInitUser(event.params.owner)
  callableLoan.backers = callableLoan.backers.concat([user.id])
  callableLoan.numBackers = callableLoan.backers.length
  callableLoan.save()
}

export function handleWithdrawalMade(event: WithdrawalMade): void {
  const callableLoan = getCallableLoan(event.address)
  const callableLoanContract = CallableLoanContract.bind(event.address)
  callableLoan.totalPrincipalPaid = callableLoanContract.totalPrincipalPaid()
  callableLoan.totalDeposited = callableLoan.totalDeposited.minus(event.params.principalWithdrawn)
  callableLoan.save()
}

export function handleDrawdownMade(event: DrawdownMade): void {
  const callableLoan = getCallableLoan(event.address)
  updatePoolTokensRedeemable(callableLoan) // Results of availableToWithdraw change after the pool is drawn down (they become 0)
  const callableLoanContract = CallableLoanContract.bind(event.address)
  callableLoan.totalPrincipalPaid = callableLoanContract.totalPrincipalPaid()
  callableLoan.principalAmount = event.params.amount
  callableLoan.balance = callableLoanContract.balance()
  callableLoan.termStartTime = callableLoanContract.termStartTime()
  callableLoan.termEndTime = callableLoanContract.termEndTime()
  callableLoan.isPaused = callableLoanContract.paused()
  callableLoan.drawdownsPaused = callableLoanContract.drawdownsPaused()
  deleteCallableLoanRepaymentSchedule(callableLoan)
  const schedulingResult = generateRepaymentScheduleForCallableLoan(callableLoan)
  callableLoan.repaymentSchedule = schedulingResult.repaymentIds
  callableLoan.numRepayments = schedulingResult.repaymentIds.length
  callableLoan.termInSeconds = schedulingResult.termInSeconds
  callableLoan.paymentFrequency = estimateCallableLoanPaymentFrequency(schedulingResult.repaymentIds)
  callableLoan.save()
}

export function handlePaymentApplied(event: PaymentApplied): void {
  const callableLoanContract = CallableLoanContract.bind(event.address)
  const callableLoan = getCallableLoan(event.address)
  callableLoan.totalPrincipalPaid = callableLoanContract.totalPrincipalPaid()
  updatePoolTokensRedeemable(callableLoan) // Results of availableToWithdraw change after a repayment is made (principal or interest can increase)
  callableLoan.balance = callableLoan.balance.minus(event.params.principal)
  callableLoan.lastFullPaymentTime = callableLoanContract.lastFullPaymentTime().toI32()
  callableLoan.save()

  updateTotalPrincipalCollected(event.params.principal)
  updateTotalInterestCollected(event.params.interest)
  updateTotalReserveCollected(event.params.reserve)
}

export function handleDrawdownsPaused(event: DrawdownsPaused): void {
  const callableLoan = getCallableLoan(event.address)
  const callableLoanContract = CallableLoanContract.bind(event.address)
  callableLoan.drawdownsPaused = callableLoanContract.drawdownsPaused()
  callableLoan.save()
}

export function handleDrawdownsUnpaused(event: DrawdownsUnpaused): void {
  const callableLoan = getCallableLoan(event.address)
  const callableLoanContract = CallableLoanContract.bind(event.address)
  callableLoan.drawdownsPaused = callableLoanContract.drawdownsPaused()
  callableLoan.save()
}

export function handleCallRequestSubmitted(event: CallRequestSubmitted): void {
  const callableLoanContract = CallableLoanContract.bind(event.address)
  const poolToken = assert(PoolToken.load(event.params.callRequestedTokenId.toString()))
  poolToken.isCapitalCalled = true
  poolToken.calledAt = event.block.timestamp.toI32()
  poolToken.callDueAt = callableLoanContract.nextPrincipalDueTime().toI32()
  poolToken.save()
}
