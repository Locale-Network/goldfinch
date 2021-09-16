import { generateMerkleRoot } from "../../../blockchain_scripts/merkleDistributor/generateMerkleRoot"
import {JsonAccountedGrant, MerkleDistributorInfo} from "../../../blockchain_scripts/merkleDistributor/types"
import {verifyMerkleRoot} from "../../../blockchain_scripts/merkleDistributor/verifyMerkleRoot"
import { genDifferentHexString } from "../../testHelpers"
import fixtures from "./fixtures"

describe("verifyMerkleRoot", () => {
  it("rejects invalid JSON", async () => {})

  it("rejects an invalid index for a grant", async () => {})

  it("rejects an invalid amount for a grant", async () => {})

  it("rejects an invalid vestingLength for a grant", async () => {})

  it("rejects an invalid cliffLength for a grant", async () => {})

  it("rejects an invalid vestingInterval for a grant", async () => {})

  it("rejects an invalid proof for a grant", async () => {})

  it("rejects an invalid root", async () => {
    const differentRoot = genDifferentHexString(fixtures.output.merkleRoot)
    const json: MerkleDistributorInfo = {
      ...fixtures.output,
      merkleRoot: differentRoot,
    }

    expect(() => verifyMerkleRoot(json)).to.throw("Failed validation for 1 or more proofs")
  })

  it("verifies a valid root", async () => {
    const json: MerkleDistributorInfo = fixtures.output

    const verificationResult = verifyMerkleRoot(json)
    expect(verificationResult).to.eql({
      reconstructedMerkleRoot: json.merkleRoot,
      matchesRootInJson: true,
    })
  })

  it("verifies a root generated by `generateMerkleRoot()`", async () => {
    const json: JsonAccountedGrant[] = fixtures.input
    const merkleDistributorInfo = generateMerkleRoot(json)
    expect(merkleDistributorInfo).to.eql(fixtures.output)
    const verificationResult = verifyMerkleRoot(merkleDistributorInfo)
    expect(verificationResult).to.eql({
      reconstructedMerkleRoot: merkleDistributorInfo.merkleRoot,
      matchesRootInJson: true,
    })
  })
})
