import { expect } from "chai";
import { ethers } from "hardhat";
import { ClawPolySearchReceipt } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("ClawPolySearchReceipt", function () {
  let receipt: ClawPolySearchReceipt;
  let owner: SignerWithAddress;
  let user: SignerWithAddress;

  const QUERY_HASH = ethers.keccak256(ethers.toUtf8Bytes("search:tx:0xabc"));
  const RESPONSE_HASH = ethers.keccak256(ethers.toUtf8Bytes("response:data"));
  const EVIDENCE_ROOT = ethers.keccak256(ethers.toUtf8Bytes("evidence:root"));
  const URI = "ipfs://Qm...";

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("ClawPolySearchReceipt");
    receipt = await Factory.deploy();
    await receipt.waitForDeployment();
  });

  describe("Deployment", function () {
    it("should start with zero receipts", async function () {
      expect(await receipt.totalReceipts()).to.equal(0);
    });
  });

  describe("Record Receipt", function () {
    it("should allow anyone to record a receipt", async function () {
      await receipt
        .connect(user)
        .recordReceipt(QUERY_HASH, RESPONSE_HASH, EVIDENCE_ROOT, URI);

      const r = await receipt.getReceipt(QUERY_HASH);
      expect(r.queryHash).to.equal(QUERY_HASH);
      expect(r.responseHash).to.equal(RESPONSE_HASH);
      expect(r.evidenceRoot).to.equal(EVIDENCE_ROOT);
      expect(r.uri).to.equal(URI);
      expect(r.recorder).to.equal(user.address);
      expect(r.blockNumber).to.be.gt(0);
      expect(r.timestamp).to.be.gt(0);
    });

    it("should increment totalReceipts", async function () {
      await receipt.recordReceipt(QUERY_HASH, RESPONSE_HASH, EVIDENCE_ROOT, URI);
      expect(await receipt.totalReceipts()).to.equal(1);
    });

    it("should reject duplicate query hash", async function () {
      await receipt.recordReceipt(QUERY_HASH, RESPONSE_HASH, EVIDENCE_ROOT, URI);
      await expect(
        receipt.recordReceipt(QUERY_HASH, RESPONSE_HASH, EVIDENCE_ROOT, URI)
      ).to.be.revertedWithCustomError(receipt, "ReceiptAlreadyExists");
    });

    it("should emit ReceiptRecorded event", async function () {
      await expect(
        receipt
          .connect(user)
          .recordReceipt(QUERY_HASH, RESPONSE_HASH, EVIDENCE_ROOT, URI)
      )
        .to.emit(receipt, "ReceiptRecorded")
        .withArgs(
          QUERY_HASH,
          RESPONSE_HASH,
          user.address,
          (v: any) => v > 0,
          (v: any) => v > 0
        );
    });
  });

  describe("Verify Receipt", function () {
    beforeEach(async function () {
      await receipt.recordReceipt(QUERY_HASH, RESPONSE_HASH, EVIDENCE_ROOT, URI);
    });

    it("should return true for matching response hash", async function () {
      expect(await receipt.verifyReceipt(QUERY_HASH, RESPONSE_HASH)).to.be.true;
    });

    it("should return false for non-matching response hash", async function () {
      const wrongHash = ethers.keccak256(ethers.toUtf8Bytes("wrong"));
      expect(await receipt.verifyReceipt(QUERY_HASH, wrongHash)).to.be.false;
    });

    it("should return false for non-existent query hash", async function () {
      const fakeQuery = ethers.keccak256(ethers.toUtf8Bytes("fake"));
      expect(await receipt.verifyReceipt(fakeQuery, RESPONSE_HASH)).to.be.false;
    });
  });

  describe("View Functions", function () {
    it("should check receipt exists", async function () {
      expect(await receipt.receiptExists(QUERY_HASH)).to.be.false;
      await receipt.recordReceipt(QUERY_HASH, RESPONSE_HASH, EVIDENCE_ROOT, URI);
      expect(await receipt.receiptExists(QUERY_HASH)).to.be.true;
    });

    it("should get recorder address", async function () {
      await receipt
        .connect(user)
        .recordReceipt(QUERY_HASH, RESPONSE_HASH, EVIDENCE_ROOT, URI);
      expect(await receipt.getRecorder(QUERY_HASH)).to.equal(user.address);
    });

    it("should revert getReceipt for non-existent", async function () {
      const fakeQuery = ethers.keccak256(ethers.toUtf8Bytes("fake"));
      await expect(receipt.getReceipt(fakeQuery)).to.be.revertedWithCustomError(
        receipt,
        "ReceiptNotFound"
      );
    });

    it("should revert getRecorder for non-existent", async function () {
      const fakeQuery = ethers.keccak256(ethers.toUtf8Bytes("fake"));
      await expect(receipt.getRecorder(fakeQuery)).to.be.revertedWithCustomError(
        receipt,
        "ReceiptNotFound"
      );
    });
  });
});
