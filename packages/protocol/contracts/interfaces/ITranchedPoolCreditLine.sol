// SPDX-License-Identifier: MIT

pragma solidity >=0.6.12;

import {ICreditLine} from "./ICreditLine.sol";
import {ISchedule} from "./ISchedule.sol";

interface ITranchedPoolCreditLine is ICreditLine {
  /// @notice Initialize a brand new credit line
  function initialize(
    address _config,
    address owner,
    address _borrower,
    uint256 _limit,
    uint256 _interestApr,
    ISchedule _schedule,
    uint256 _lateFeeApr
  ) external;
}
