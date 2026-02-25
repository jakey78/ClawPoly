// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title ClawPolyFeeVault
 * @notice Receives and distributes fees among configurable recipients.
 */
contract ClawPolyFeeVault is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    struct Recipient {
        address account;
        uint256 bps; // basis points (1/10000)
    }

    Recipient[] private _recipients;
    uint256 public constant MAX_BPS = 10000;

    event FeeDistributed(
        address indexed token,
        uint256 totalAmount,
        uint256 timestamp
    );
    event NativeFeeDistributed(
        uint256 totalAmount,
        uint256 timestamp
    );
    event RecipientsUpdated(
        uint256 recipientCount,
        uint256 timestamp
    );
    event FeeReceived(
        address indexed from,
        uint256 amount,
        uint256 timestamp
    );

    error NoRecipients();
    error InvalidBPS();
    error NoBalance();
    error TransferFailed();

    constructor(address initialOwner) Ownable(initialOwner) {}

    /**
     * @notice Receive native MATIC fees.
     */
    receive() external payable {
        emit FeeReceived(msg.sender, msg.value, block.timestamp);
    }

    /**
     * @notice Set fee recipients with basis-point splits.
     * @param recipients Array of Recipient structs. BPS must sum to 10000.
     */
    function setRecipients(Recipient[] calldata recipients) external onlyOwner {
        if (recipients.length == 0) revert NoRecipients();

        uint256 totalBps;
        for (uint256 i = 0; i < recipients.length; i++) {
            totalBps += recipients[i].bps;
        }
        if (totalBps != MAX_BPS) revert InvalidBPS();

        delete _recipients;
        for (uint256 i = 0; i < recipients.length; i++) {
            _recipients.push(recipients[i]);
        }

        emit RecipientsUpdated(recipients.length, block.timestamp);
    }

    /**
     * @notice Distribute native MATIC balance among recipients.
     */
    function distribute() external nonReentrant {
        if (_recipients.length == 0) revert NoRecipients();

        uint256 balance = address(this).balance;
        if (balance == 0) revert NoBalance();

        for (uint256 i = 0; i < _recipients.length; i++) {
            uint256 share = (balance * _recipients[i].bps) / MAX_BPS;
            if (share > 0) {
                (bool success, ) = _recipients[i].account.call{value: share}("");
                if (!success) revert TransferFailed();
            }
        }

        emit NativeFeeDistributed(balance, block.timestamp);
    }

    /**
     * @notice Distribute ERC20 token balance among recipients.
     * @param token The ERC20 token address to distribute.
     */
    function distributeERC20(address token) external nonReentrant {
        if (_recipients.length == 0) revert NoRecipients();

        IERC20 erc20 = IERC20(token);
        uint256 balance = erc20.balanceOf(address(this));
        if (balance == 0) revert NoBalance();

        for (uint256 i = 0; i < _recipients.length; i++) {
            uint256 share = (balance * _recipients[i].bps) / MAX_BPS;
            if (share > 0) {
                erc20.safeTransfer(_recipients[i].account, share);
            }
        }

        emit FeeDistributed(token, balance, block.timestamp);
    }

    /**
     * @notice Get the number of recipients.
     */
    function getRecipientCount() external view returns (uint256) {
        return _recipients.length;
    }

    /**
     * @notice Get a recipient by index.
     */
    function getRecipient(uint256 index) external view returns (address account, uint256 bps) {
        Recipient storage r = _recipients[index];
        return (r.account, r.bps);
    }
}
