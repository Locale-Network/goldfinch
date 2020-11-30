/* global artifacts web3 */
const {expect, bigVal, getDeployedAsTruffleContract} = require("./testHelpers.js")
const {OWNER_ROLE} = require("../blockchain_scripts/deployHelpers")
const hre = require("hardhat")
const {deployments} = hre
const ConfigOptions = artifacts.require("ConfigOptions")
const GoldfinchConfig = artifacts.require("GoldfinchConfig")
const Fidu = artifacts.require("Fidu")

describe("Fidu", () => {
  const testSetup = deployments.createFixture(async ({deployments, getNamedAccounts}) => {
    // Just to be crystal clear
    const {protocol_owner} = await getNamedAccounts()
    owner = protocol_owner

    await deployments.run("base_deploy")
    const fidu = await getDeployedAsTruffleContract(deployments, "Fidu")

    return {fidu, goldfinchConfig}
  })

  before(async () => {
    const configOptions = await ConfigOptions.new({from: owner})
    GoldfinchConfig.link(configOptions)
  })

  let owner, person2, goldfinchConfig, fidu, accounts
  beforeEach(async () => {
    // Pull in our unlocked accounts
    accounts = await web3.eth.getAccounts()
    ;[owner, person2] = accounts

    goldfinchConfig = await GoldfinchConfig.new({from: owner})
    await goldfinchConfig.initialize(owner)

    fidu = await Fidu.new({from: owner})
    await fidu.__initialize__(owner, "Fidu", "FIDU", goldfinchConfig.address)
  })

  describe("initialization", async () => {
    it("should not allow it to be called twice", async () => {
      return expect(fidu.__initialize__(person2, "Fidu", "FIDU", goldfinchConfig.address)).to.be.rejectedWith(
        /has already been initialized/
      )
    })
  })

  describe("ownership", async () => {
    it("should be owned by the owner", async () => {
      expect(await fidu.hasRole(OWNER_ROLE, owner)).to.be.true
    })
  })

  describe("mintTo", async () => {
    beforeEach(async () => {
      // Use the full deployment so we have a pool, and the
      // mintTo function doesn't fail early on the assets/liabilites check
      const deployments = await testSetup()
      fidu = deployments.fidu
    })
    it("should allow the minter to call it", async () => {
      return expect(fidu.mintTo(person2, bigVal(0), {from: owner})).to.be.fulfilled
    })
    it("should not allow anyone else to call it", async () => {
      return expect(fidu.mintTo(person2, bigVal(0), {from: person2})).to.be.rejectedWith(/minter role/)
    })
  })
})