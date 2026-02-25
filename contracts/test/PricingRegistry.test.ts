import { expect } from "chai";
import { ethers } from "hardhat";
import {
  ClawPolyAccessController,
  ClawPolyPricingRegistry,
} from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("ClawPolyPricingRegistry", function () {
  let accessController: ClawPolyAccessController;
  let pricing: ClawPolyPricingRegistry;
  let owner: SignerWithAddress;
  let operator: SignerWithAddress;
  let user: SignerWithAddress;

  const USDC_ADDRESS = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";
  const ENDPOINT_ID = ethers.keccak256(ethers.toUtf8Bytes("search/tx"));
  const PRICE_1000 = 1000n; // $0.001 in USDC (6 decimals)

  beforeEach(async function () {
    [owner, operator, user] = await ethers.getSigners();

    const ACFactory = await ethers.getContractFactory("ClawPolyAccessController");
    accessController = await ACFactory.deploy();
    await accessController.waitForDeployment();

    await accessController.grantOperator(operator.address);

    const Factory = await ethers.getContractFactory("ClawPolyPricingRegistry");
    pricing = await Factory.deploy(
      await accessController.getAddress(),
      USDC_ADDRESS
    );
    await pricing.waitForDeployment();
  });

  describe("Deployment", function () {
    it("should set the access controller", async function () {
      expect(await pricing.accessController()).to.equal(
        await accessController.getAddress()
      );
    });

    it("should set the payment token", async function () {
      expect(await pricing.paymentToken()).to.equal(USDC_ADDRESS);
    });
  });

  describe("Set Price", function () {
    it("should allow operator to set price", async function () {
      await pricing.connect(operator).setPrice(ENDPOINT_ID, PRICE_1000);
      expect(await pricing.getPrice(ENDPOINT_ID)).to.equal(PRICE_1000);
    });

    it("should not allow non-operator to set price", async function () {
      await expect(
        pricing.connect(user).setPrice(ENDPOINT_ID, PRICE_1000)
      ).to.be.revertedWithCustomError(pricing, "Unauthorized");
    });

    it("should emit PriceUpdated event", async function () {
      await expect(pricing.connect(operator).setPrice(ENDPOINT_ID, PRICE_1000))
        .to.emit(pricing, "PriceUpdated")
        .withArgs(ENDPOINT_ID, 0, PRICE_1000, operator.address, (v: any) => v > 0);
    });

    it("should update existing price", async function () {
      await pricing.connect(operator).setPrice(ENDPOINT_ID, PRICE_1000);
      const newPrice = 2000n;
      await expect(pricing.connect(operator).setPrice(ENDPOINT_ID, newPrice))
        .to.emit(pricing, "PriceUpdated")
        .withArgs(ENDPOINT_ID, PRICE_1000, newPrice, operator.address, (v: any) => v > 0);

      expect(await pricing.getPrice(ENDPOINT_ID)).to.equal(newPrice);
    });
  });

  describe("Batch Set Prices", function () {
    it("should set multiple prices", async function () {
      const id2 = ethers.keccak256(ethers.toUtf8Bytes("search/address"));
      await pricing
        .connect(operator)
        .batchSetPrices([ENDPOINT_ID, id2], [1000n, 2000n]);

      expect(await pricing.getPrice(ENDPOINT_ID)).to.equal(1000n);
      expect(await pricing.getPrice(id2)).to.equal(2000n);
    });

    it("should revert on array length mismatch", async function () {
      await expect(
        pricing.connect(operator).batchSetPrices([ENDPOINT_ID], [1000n, 2000n])
      ).to.be.revertedWithCustomError(pricing, "ArrayLengthMismatch");
    });
  });

  describe("Payment Token", function () {
    it("should allow admin to update payment token", async function () {
      const newToken = ethers.Wallet.createRandom().address;
      await pricing.connect(owner).setPaymentToken(newToken);
      expect(await pricing.paymentToken()).to.equal(newToken);
    });

    it("should not allow non-admin to update payment token", async function () {
      const newToken = ethers.Wallet.createRandom().address;
      await expect(
        pricing.connect(user).setPaymentToken(newToken)
      ).to.be.revertedWithCustomError(pricing, "Unauthorized");
    });

    it("should emit PaymentTokenUpdated event", async function () {
      const newToken = ethers.Wallet.createRandom().address;
      await expect(pricing.connect(owner).setPaymentToken(newToken))
        .to.emit(pricing, "PaymentTokenUpdated")
        .withArgs(USDC_ADDRESS, newToken, (v: any) => v > 0);
    });
  });

  describe("Get Price", function () {
    it("should return 0 for unset endpoint", async function () {
      const fakeId = ethers.keccak256(ethers.toUtf8Bytes("unknown"));
      expect(await pricing.getPrice(fakeId)).to.equal(0);
    });
  });
});
