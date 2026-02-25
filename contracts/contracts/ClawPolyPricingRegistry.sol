// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./ClawPolyAccessController.sol";

/**
 * @title ClawPolyPricingRegistry
 * @notice Stores per-endpoint pricing in USDC micro-units (6 decimals).
 */
contract ClawPolyPricingRegistry {
    ClawPolyAccessController public accessController;
    address public paymentToken;

    mapping(bytes32 => uint256) private _prices;

    event PriceUpdated(
        bytes32 indexed endpointId,
        uint256 oldPrice,
        uint256 newPrice,
        address indexed updatedBy,
        uint256 timestamp
    );
    event PaymentTokenUpdated(
        address indexed oldToken,
        address indexed newToken,
        uint256 timestamp
    );

    error Unauthorized();
    error InvalidPrice();
    error ArrayLengthMismatch();

    modifier onlyOperator() {
        if (!accessController.isOperator(msg.sender)) revert Unauthorized();
        _;
    }

    modifier onlyAdmin() {
        if (!accessController.isAdmin(msg.sender)) revert Unauthorized();
        _;
    }

    /**
     * @param _accessController Address of the ClawPolyAccessController.
     * @param _paymentToken Address of the ERC20 payment token (USDC).
     */
    constructor(address _accessController, address _paymentToken) {
        accessController = ClawPolyAccessController(_accessController);
        paymentToken = _paymentToken;
    }

    /**
     * @notice Set price for an endpoint.
     * @param endpointId The endpoint identifier.
     * @param priceUSDC Price in USDC micro-units (6 decimals). e.g., 1000 = $0.001.
     */
    function setPrice(bytes32 endpointId, uint256 priceUSDC) external onlyOperator {
        uint256 oldPrice = _prices[endpointId];
        _prices[endpointId] = priceUSDC;

        emit PriceUpdated(endpointId, oldPrice, priceUSDC, msg.sender, block.timestamp);
    }

    /**
     * @notice Batch set prices for multiple endpoints.
     * @param endpointIds Array of endpoint identifiers.
     * @param prices Array of prices in USDC micro-units.
     */
    function batchSetPrices(
        bytes32[] calldata endpointIds,
        uint256[] calldata prices
    ) external onlyOperator {
        if (endpointIds.length != prices.length) revert ArrayLengthMismatch();

        for (uint256 i = 0; i < endpointIds.length; i++) {
            uint256 oldPrice = _prices[endpointIds[i]];
            _prices[endpointIds[i]] = prices[i];
            emit PriceUpdated(endpointIds[i], oldPrice, prices[i], msg.sender, block.timestamp);
        }
    }

    /**
     * @notice Get price for an endpoint.
     * @param endpointId The endpoint identifier.
     * @return Price in USDC micro-units.
     */
    function getPrice(bytes32 endpointId) external view returns (uint256) {
        return _prices[endpointId];
    }

    /**
     * @notice Update the payment token address.
     * @param _newToken New ERC20 token address.
     */
    function setPaymentToken(address _newToken) external onlyAdmin {
        address oldToken = paymentToken;
        paymentToken = _newToken;
        emit PaymentTokenUpdated(oldToken, _newToken, block.timestamp);
    }
}
