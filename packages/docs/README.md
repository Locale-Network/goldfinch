# Website

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.

### Installation

From the repo root:
```
$ yarn bootstrap
```

### Local Development

#### To generate Markdown docs from our Solidity smart contracts:

From `packages/docs`:
```
$ yarn build-contract-docs
```

The Markdown files generated by this command are tracked in version control. When you want to update the smart contract docs that are deployed on the docs site, you must run this command and commit the changes you want. We intentionally require this manual step, and do not execute this command as part of the `"build"` script, so that changes to the NatSpec comments in our smart contracts are not automatically deployed to the docs site. It wouldn't necessarily be appropriate to deploy such changes automatically, as they might describe contract behavior that has not yet been deployed to mainnet.

#### To serve the docs locally:

From `packages/docs`:
```
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

From `packages/docs`:
```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.