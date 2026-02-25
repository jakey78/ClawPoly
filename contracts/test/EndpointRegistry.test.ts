import { expect } from "chai";
import { ethers } from "hardhat";
import {
  ClawPolyAccessController,
  ClawPolyEndpointRegistry,
} from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("ClawPolyEndpointRegistry", function () {
  let accessController: ClawPolyAccessController;
  let registry: ClawPolyEndpointRegistry;
  let owner: SignerWithAddress;
  let operator: SignerWithAddress;
  let user: SignerWithAddress;

  const ENDPOINT_ID = ethers.keccak256(ethers.toUtf8Bytes("search/tx"));

  beforeEach(async function () {
    [owner, operator, user] = await ethers.getSigners();

    const ACFactory = await ethers.getContractFactory("ClawPolyAccessController");
    accessController = await ACFactory.deploy();
    await accessController.waitForDeployment();

    await accessController.grantOperator(operator.address);

    const Factory = await ethers.getContractFactory("ClawPolyEndpointRegistry");
    registry = await Factory.deploy(await accessController.getAddress());
    await registry.waitForDeployment();
  });

  describe("Deployment", function () {
    it("should set the access controller", async function () {
      expect(await registry.accessController()).to.equal(
        await accessController.getAddress()
      );
    });

    it("should start with zero endpoints", async function () {
      expect(await registry.getEndpointCount()).to.equal(0);
    });
  });

  describe("Register Endpoint", function () {
    it("should allow operator to register endpoint", async function () {
      await registry
        .connect(operator)
        .registerEndpoint(ENDPOINT_ID, "Transaction Search", "Search by tx hash", "search,tx");

      const ep = await registry.getEndpoint(ENDPOINT_ID);
      expect(ep.name).to.equal("Transaction Search");
      expect(ep.description).to.equal("Search by tx hash");
      expect(ep.tags).to.equal("search,tx");
      expect(ep.enabled).to.be.true;
      expect(ep.creator).to.equal(operator.address);
    });

    it("should not allow non-operator to register", async function () {
      await expect(
        registry
          .connect(user)
          .registerEndpoint(ENDPOINT_ID, "Test", "Test", "test")
      ).to.be.revertedWithCustomError(registry, "Unauthorized");
    });

    it("should reject duplicate endpoint IDs", async function () {
      await registry
        .connect(operator)
        .registerEndpoint(ENDPOINT_ID, "Test", "Test", "test");
      await expect(
        registry
          .connect(operator)
          .registerEndpoint(ENDPOINT_ID, "Test2", "Test2", "test")
      ).to.be.revertedWithCustomError(registry, "EndpointAlreadyExists");
    });

    it("should emit EndpointRegistered event", async function () {
      await expect(
        registry
          .connect(operator)
          .registerEndpoint(ENDPOINT_ID, "Transaction Search", "Search by tx hash", "search,tx")
      )
        .to.emit(registry, "EndpointRegistered")
        .withArgs(ENDPOINT_ID, "Transaction Search", operator.address, (v: any) => v > 0);
    });

    it("should increment endpoint count", async function () {
      await registry
        .connect(operator)
        .registerEndpoint(ENDPOINT_ID, "Test", "Test", "test");
      expect(await registry.getEndpointCount()).to.equal(1);
    });
  });

  describe("Update Endpoint", function () {
    beforeEach(async function () {
      await registry
        .connect(operator)
        .registerEndpoint(ENDPOINT_ID, "Original", "Original desc", "orig");
    });

    it("should allow operator to update endpoint", async function () {
      await registry
        .connect(operator)
        .updateEndpoint(ENDPOINT_ID, "Updated", "Updated desc", "updated");

      const ep = await registry.getEndpoint(ENDPOINT_ID);
      expect(ep.name).to.equal("Updated");
      expect(ep.description).to.equal("Updated desc");
    });

    it("should reject update of non-existent endpoint", async function () {
      const fakeId = ethers.keccak256(ethers.toUtf8Bytes("fake"));
      await expect(
        registry.connect(operator).updateEndpoint(fakeId, "Test", "Test", "test")
      ).to.be.revertedWithCustomError(registry, "EndpointNotFound");
    });

    it("should emit EndpointUpdated event", async function () {
      await expect(
        registry
          .connect(operator)
          .updateEndpoint(ENDPOINT_ID, "Updated", "Updated desc", "updated")
      ).to.emit(registry, "EndpointUpdated");
    });
  });

  describe("Toggle Endpoint", function () {
    beforeEach(async function () {
      await registry
        .connect(operator)
        .registerEndpoint(ENDPOINT_ID, "Test", "Test", "test");
    });

    it("should disable an endpoint", async function () {
      await registry.connect(operator).setEnabled(ENDPOINT_ID, false);
      expect(await registry.isEnabled(ENDPOINT_ID)).to.be.false;
    });

    it("should re-enable an endpoint", async function () {
      await registry.connect(operator).setEnabled(ENDPOINT_ID, false);
      await registry.connect(operator).setEnabled(ENDPOINT_ID, true);
      expect(await registry.isEnabled(ENDPOINT_ID)).to.be.true;
    });

    it("should emit EndpointToggled event", async function () {
      await expect(registry.connect(operator).setEnabled(ENDPOINT_ID, false))
        .to.emit(registry, "EndpointToggled")
        .withArgs(ENDPOINT_ID, false, (v: any) => v > 0);
    });
  });

  describe("View Functions", function () {
    it("should return endpoint by index", async function () {
      await registry
        .connect(operator)
        .registerEndpoint(ENDPOINT_ID, "Test", "Test", "test");
      expect(await registry.getEndpointIdByIndex(0)).to.equal(ENDPOINT_ID);
    });

    it("should revert for non-existent endpoint getEndpoint", async function () {
      const fakeId = ethers.keccak256(ethers.toUtf8Bytes("nonexistent"));
      await expect(registry.getEndpoint(fakeId)).to.be.revertedWithCustomError(
        registry,
        "EndpointNotFound"
      );
    });
  });
});
