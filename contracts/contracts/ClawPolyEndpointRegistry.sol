// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./ClawPolyAccessController.sol";

/**
 * @title ClawPolyEndpointRegistry
 * @notice Registers and manages search endpoint metadata.
 */
contract ClawPolyEndpointRegistry {
    struct Endpoint {
        string name;
        string description;
        string tags;
        bool enabled;
        address creator;
        uint256 createdAt;
        uint256 updatedAt;
    }

    ClawPolyAccessController public accessController;

    mapping(bytes32 => Endpoint) private _endpoints;
    bytes32[] private _endpointIds;

    event EndpointRegistered(
        bytes32 indexed endpointId,
        string name,
        address indexed creator,
        uint256 timestamp
    );
    event EndpointUpdated(
        bytes32 indexed endpointId,
        string name,
        string description,
        string tags,
        uint256 timestamp
    );
    event EndpointToggled(
        bytes32 indexed endpointId,
        bool enabled,
        uint256 timestamp
    );

    error Unauthorized();
    error EndpointAlreadyExists(bytes32 endpointId);
    error EndpointNotFound(bytes32 endpointId);

    modifier onlyOperator() {
        if (!accessController.isOperator(msg.sender)) revert Unauthorized();
        _;
    }

    constructor(address _accessController) {
        accessController = ClawPolyAccessController(_accessController);
    }

    /**
     * @notice Register a new endpoint.
     * @param endpointId Unique bytes32 identifier for the endpoint.
     * @param name Human-readable name.
     * @param description Description of the endpoint.
     * @param tags Comma-separated tags.
     */
    function registerEndpoint(
        bytes32 endpointId,
        string calldata name,
        string calldata description,
        string calldata tags
    ) external onlyOperator {
        if (_endpoints[endpointId].createdAt != 0) {
            revert EndpointAlreadyExists(endpointId);
        }

        _endpoints[endpointId] = Endpoint({
            name: name,
            description: description,
            tags: tags,
            enabled: true,
            creator: msg.sender,
            createdAt: block.timestamp,
            updatedAt: block.timestamp
        });

        _endpointIds.push(endpointId);

        emit EndpointRegistered(endpointId, name, msg.sender, block.timestamp);
    }

    /**
     * @notice Update endpoint metadata.
     */
    function updateEndpoint(
        bytes32 endpointId,
        string calldata name,
        string calldata description,
        string calldata tags
    ) external onlyOperator {
        if (_endpoints[endpointId].createdAt == 0) {
            revert EndpointNotFound(endpointId);
        }

        Endpoint storage ep = _endpoints[endpointId];
        ep.name = name;
        ep.description = description;
        ep.tags = tags;
        ep.updatedAt = block.timestamp;

        emit EndpointUpdated(endpointId, name, description, tags, block.timestamp);
    }

    /**
     * @notice Enable or disable an endpoint.
     */
    function setEnabled(bytes32 endpointId, bool enabled) external onlyOperator {
        if (_endpoints[endpointId].createdAt == 0) {
            revert EndpointNotFound(endpointId);
        }

        _endpoints[endpointId].enabled = enabled;
        _endpoints[endpointId].updatedAt = block.timestamp;

        emit EndpointToggled(endpointId, enabled, block.timestamp);
    }

    /**
     * @notice Get endpoint details.
     */
    function getEndpoint(bytes32 endpointId) external view returns (Endpoint memory) {
        if (_endpoints[endpointId].createdAt == 0) {
            revert EndpointNotFound(endpointId);
        }
        return _endpoints[endpointId];
    }

    /**
     * @notice Check if an endpoint is enabled.
     */
    function isEnabled(bytes32 endpointId) external view returns (bool) {
        return _endpoints[endpointId].enabled && _endpoints[endpointId].createdAt != 0;
    }

    /**
     * @notice Get total number of registered endpoints.
     */
    function getEndpointCount() external view returns (uint256) {
        return _endpointIds.length;
    }

    /**
     * @notice Get endpoint ID by index.
     */
    function getEndpointIdByIndex(uint256 index) external view returns (bytes32) {
        return _endpointIds[index];
    }
}
