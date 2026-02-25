import { expect } from "chai";
import { ethers } from "hardhat";
import { ClawPolyFeeVault } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("ClawPolyFeeVault", function () {
  let vault: ClawPolyFeeVault;
  let owner: SignerWithAddress;
  let recipientA: SignerWithAddress;
  let recipientB: SignerWithAddress;
  let user: SignerWithAddress;

  beforeEach(async function () {
    [owner, recipientA, recipientB, user] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("ClawPolyFeeVault");
    vault = await Factory.deploy(owner.address);
    await vault.waitForDeployment();
  });

  describe("Deployment", function () {
    it("should set the owner", async function () {
      expect(await vault.owner()).to.equal(owner.address);
    });

    it("should start with zero recipients", async function () {
      expect(await vault.getRecipientCount()).to.equal(0);
    });
  });

  describe("Set Recipients", function () {
    it("should allow owner to set recipients", async function () {
      await vault.setRecipients([
        { account: recipientA.address, bps: 7000 },
        { account: recipientB.address, bps: 3000 },
      ]);
      expect(await vault.getRecipientCount()).to.equal(2);

      const [addrA, bpsA] = await vault.getRecipient(0);
      expect(addrA).to.equal(recipientA.address);
      expect(bpsA).to.equal(7000);

      const [addrB, bpsB] = await vault.getRecipient(1);
      expect(addrB).to.equal(recipientB.address);
      expect(bpsB).to.equal(3000);
    });

    it("should reject BPS not summing to 10000", async function () {
      await expect(
        vault.setRecipients([
          { account: recipientA.address, bps: 5000 },
          { account: recipientB.address, bps: 4000 },
        ])
      ).to.be.revertedWithCustomError(vault, "InvalidBPS");
    });

    it("should reject empty recipients", async function () {
      await expect(vault.setRecipients([])).to.be.revertedWithCustomError(
        vault,
        "NoRecipients"
      );
    });

    it("should not allow non-owner to set recipients", async function () {
      await expect(
        vault.connect(user).setRecipients([
          { account: recipientA.address, bps: 10000 },
        ])
      ).to.be.reverted;
    });

    it("should emit RecipientsUpdated event", async function () {
      await expect(
        vault.setRecipients([
          { account: recipientA.address, bps: 10000 },
        ])
      )
        .to.emit(vault, "RecipientsUpdated")
        .withArgs(1, (v: any) => v > 0);
    });
  });

  describe("Distribute Native", function () {
    beforeEach(async function () {
      await vault.setRecipients([
        { account: recipientA.address, bps: 6000 },
        { account: recipientB.address, bps: 4000 },
      ]);
    });

    it("should distribute native balance", async function () {
      const amount = ethers.parseEther("1.0");
      await owner.sendTransaction({
        to: await vault.getAddress(),
        value: amount,
      });

      const balA_before = await ethers.provider.getBalance(recipientA.address);
      const balB_before = await ethers.provider.getBalance(recipientB.address);

      await vault.distribute();

      const balA_after = await ethers.provider.getBalance(recipientA.address);
      const balB_after = await ethers.provider.getBalance(recipientB.address);

      expect(balA_after - balA_before).to.equal(ethers.parseEther("0.6"));
      expect(balB_after - balB_before).to.equal(ethers.parseEther("0.4"));
    });

    it("should revert if no balance", async function () {
      await expect(vault.distribute()).to.be.revertedWithCustomError(
        vault,
        "NoBalance"
      );
    });

    it("should revert if no recipients set", async function () {
      const Factory = await ethers.getContractFactory("ClawPolyFeeVault");
      const emptyVault = await Factory.deploy(owner.address);
      await emptyVault.waitForDeployment();

      await owner.sendTransaction({
        to: await emptyVault.getAddress(),
        value: ethers.parseEther("1.0"),
      });

      await expect(emptyVault.distribute()).to.be.revertedWithCustomError(
        emptyVault,
        "NoRecipients"
      );
    });

    it("should emit NativeFeeDistributed event", async function () {
      const amount = ethers.parseEther("1.0");
      await owner.sendTransaction({
        to: await vault.getAddress(),
        value: amount,
      });

      await expect(vault.distribute())
        .to.emit(vault, "NativeFeeDistributed")
        .withArgs(amount, (v: any) => v > 0);
    });
  });

  describe("Receive", function () {
    it("should accept native payments", async function () {
      const amount = ethers.parseEther("0.5");
      await expect(
        owner.sendTransaction({
          to: await vault.getAddress(),
          value: amount,
        })
      )
        .to.emit(vault, "FeeReceived")
        .withArgs(owner.address, amount, (v: any) => v > 0);
    });
  });
});
