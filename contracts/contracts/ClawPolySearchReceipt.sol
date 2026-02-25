// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title ClawPolySearchReceipt
 * @notice Records and verifies search receipt attestations on-chain.
 * @dev Permissionless — anyone can record a receipt.
 */
contract ClawPolySearchReceipt {
    struct Receipt {
        bytes32 queryHash;
        bytes32 responseHash;
        bytes32 evidenceRoot;
        string uri;
        address recorder;
        uint256 blockNumber;
        uint256 timestamp;
    }

    mapping(bytes32 => Receipt) private _receipts;
    uint256 public totalReceipts;

    event ReceiptRecorded(
        bytes32 indexed queryHash,
        bytes32 indexed responseHash,
        address indexed recorder,
        uint256 blockNumber,
        uint256 timestamp
    );

    error ReceiptAlreadyExists(bytes32 queryHash);
    error ReceiptNotFound(bytes32 queryHash);

    /**
     * @notice Record a search receipt.
     * @param queryHash Hash of the search query.
     * @param responseHash Hash of the search response.
     * @param evidenceRoot Merkle root of the evidence bundle.
     * @param uri URI pointing to the full evidence (e.g., IPFS).
     */
    function recordReceipt(
        bytes32 queryHash,
        bytes32 responseHash,
        bytes32 evidenceRoot,
        string calldata uri
    ) external {
        if (_receipts[queryHash].timestamp != 0) {
            revert ReceiptAlreadyExists(queryHash);
        }

        _receipts[queryHash] = Receipt({
            queryHash: queryHash,
            responseHash: responseHash,
            evidenceRoot: evidenceRoot,
            uri: uri,
            recorder: msg.sender,
            blockNumber: block.number,
            timestamp: block.timestamp
        });

        totalReceipts++;

        emit ReceiptRecorded(
            queryHash,
            responseHash,
            msg.sender,
            block.number,
            block.timestamp
        );
    }

    /**
     * @notice Get a receipt by query hash.
     * @param queryHash The query hash to look up.
     * @return The Receipt struct.
     */
    function getReceipt(bytes32 queryHash) external view returns (Receipt memory) {
        if (_receipts[queryHash].timestamp == 0) {
            revert ReceiptNotFound(queryHash);
        }
        return _receipts[queryHash];
    }

    /**
     * @notice Verify that a receipt matches an expected response hash.
     * @param queryHash The query hash.
     * @param expectedResponseHash The expected response hash.
     * @return valid True if the receipt exists and the response hash matches.
     */
    function verifyReceipt(
        bytes32 queryHash,
        bytes32 expectedResponseHash
    ) external view returns (bool valid) {
        Receipt storage r = _receipts[queryHash];
        if (r.timestamp == 0) return false;
        return r.responseHash == expectedResponseHash;
    }

    /**
     * @notice Check if a receipt exists for a query hash.
     * @param queryHash The query hash.
     * @return True if a receipt exists.
     */
    function receiptExists(bytes32 queryHash) external view returns (bool) {
        return _receipts[queryHash].timestamp != 0;
    }

    /**
     * @notice Get the recorder address for a receipt.
     * @param queryHash The query hash.
     * @return The address that recorded the receipt.
     */
    function getRecorder(bytes32 queryHash) external view returns (address) {
        if (_receipts[queryHash].timestamp == 0) {
            revert ReceiptNotFound(queryHash);
        }
        return _receipts[queryHash].recorder;
    }
}
