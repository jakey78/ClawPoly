import { expect } from "chai";
import { ethers } from "hardhat";
import { ClawPolyAccessController } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("ClawPolyAccessController", function () {
  let controller: ClawPolyAccessController;
  let owner: SignerWithAddress;
  let admin: SignerWithAddress;
  let operator: SignerWithAddress;
  let user: SignerWithAddress;

  const ADMIN_ROLE = ethers.keccak256(ethers.toUtf8Bytes("ADMIN_ROLE"));
  const OPERATOR_ROLE = ethers.keccak256(ethers.toUtf8Bytes("OPERATOR_ROLE"));

  beforeEach(async function () {
    [owner, admin, operator, user] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("ClawPolyAccessController");
    controller = await Factory.deploy();
    await controller.waitForDeployment();
  });

  describe("Deployment", function () {
    it("should grant deployer DEFAULT_ADMIN_ROLE", async function () {
      const DEFAULT_ADMIN_ROLE = await controller.DEFAULT_ADMIN_ROLE();
      expect(await controller.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to.be.true;
    });

    it("should grant deployer ADMIN_ROLE", async function () {
      expect(await controller.isAdmin(owner.address)).to.be.true;
    });

    it("should grant deployer OPERATOR_ROLE", async function () {
      expect(await controller.isOperator(owner.address)).to.be.true;
    });
  });

  describe("Role Management", function () {
    it("should allow admin to grant admin role", async function () {
      await controller.grantAdmin(admin.address);
      expect(await controller.isAdmin(admin.address)).to.be.true;
    });

    it("should allow admin to grant operator role", async function () {
      await controller.grantOperator(operator.address);
      expect(await controller.isOperator(operator.address)).to.be.true;
    });

    it("should not allow non-admin to grant roles", async function () {
      await expect(
        controller.connect(user).grantAdmin(admin.address)
      ).to.be.reverted;
    });

    it("should allow admin to revoke admin role", async function () {
      await controller.grantAdmin(admin.address);
      await controller.revokeAdmin(admin.address);
      expect(await controller.isAdmin(admin.address)).to.be.false;
    });

    it("should allow admin to revoke operator role", async function () {
      await controller.grantOperator(operator.address);
      await controller.revokeOperator(operator.address);
      expect(await controller.isOperator(operator.address)).to.be.false;
    });

    it("should emit AdminGranted event", async function () {
      await expect(controller.grantAdmin(admin.address))
        .to.emit(controller, "AdminGranted")
        .withArgs(admin.address, owner.address);
    });

    it("should emit OperatorGranted event", async function () {
      await expect(controller.grantOperator(operator.address))
        .to.emit(controller, "OperatorGranted")
        .withArgs(operator.address, owner.address);
    });

    it("should emit AdminRevoked event", async function () {
      await controller.grantAdmin(admin.address);
      await expect(controller.revokeAdmin(admin.address))
        .to.emit(controller, "AdminRevoked")
        .withArgs(admin.address, owner.address);
    });

    it("should emit OperatorRevoked event", async function () {
      await controller.grantOperator(operator.address);
      await expect(controller.revokeOperator(operator.address))
        .to.emit(controller, "OperatorRevoked")
        .withArgs(operator.address, owner.address);
    });
  });
});
