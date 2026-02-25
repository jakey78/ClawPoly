// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title ClawPolyAccessController
 * @notice Central role management for ClawPoly protocol.
 * @dev Uses OpenZeppelin AccessControl with ADMIN_ROLE and OPERATOR_ROLE.
 */
contract ClawPolyAccessController is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    event AdminGranted(address indexed account, address indexed sender);
    event OperatorGranted(address indexed account, address indexed sender);
    event AdminRevoked(address indexed account, address indexed sender);
    event OperatorRevoked(address indexed account, address indexed sender);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(OPERATOR_ROLE, msg.sender);
    }

    /**
     * @notice Grant admin role to an address.
     * @param account The address to grant admin role.
     */
    function grantAdmin(address account) external onlyRole(ADMIN_ROLE) {
        grantRole(ADMIN_ROLE, account);
        emit AdminGranted(account, msg.sender);
    }

    /**
     * @notice Grant operator role to an address.
     * @param account The address to grant operator role.
     */
    function grantOperator(address account) external onlyRole(ADMIN_ROLE) {
        grantRole(OPERATOR_ROLE, account);
        emit OperatorGranted(account, msg.sender);
    }

    /**
     * @notice Revoke admin role from an address.
     * @param account The address to revoke admin role from.
     */
    function revokeAdmin(address account) external onlyRole(ADMIN_ROLE) {
        revokeRole(ADMIN_ROLE, account);
        emit AdminRevoked(account, msg.sender);
    }

    /**
     * @notice Revoke operator role from an address.
     * @param account The address to revoke operator role from.
     */
    function revokeOperator(address account) external onlyRole(ADMIN_ROLE) {
        revokeRole(OPERATOR_ROLE, account);
        emit OperatorRevoked(account, msg.sender);
    }

    /**
     * @notice Check whether an address is an admin.
     */
    function isAdmin(address account) external view returns (bool) {
        return hasRole(ADMIN_ROLE, account);
    }

    /**
     * @notice Check whether an address is an operator.
     */
    function isOperator(address account) external view returns (bool) {
        return hasRole(OPERATOR_ROLE, account);
    }
}
