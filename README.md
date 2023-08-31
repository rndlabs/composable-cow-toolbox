# Composable Cow Toolbox

## What is this?

This is a rapid prototyping toolbox for the Composable Cow project. It is a collection of tools that can be used to quickly create and test new ideas. It is not intended to be a production-ready application.

## Features

1. Upgrading of `Safe` to `ExtensibleFallbackHandler` + `ComposableCoW` domain verifier.
2. Reversion of the `Safe` back to the stock (supports 1.3.0 `Safe`) fallback handler.
3. Placement of simple swaps via off-chain signature aggregation (using `Safe`'s signed messages). No more setPreSignature!.
4. Placement of a single conditional order (with selectable type).
5. Placement of multiple conditional orders (WIP).

## Developers

### Setup

1. Clone the repo.
2. Run `pnpm install` to install dependencies.
3. Run `pnpm run dev` to start the dev server.
4. Add the Custom App in your `Safe`: https://localhost:5173 

**NOTE**: If the page takes too long to load, this may be because the first time you load the localhost via SSL, you have to manually trust the development server's self-generated SSL certificate.

### Repo structure

This repository favours moving fast and rapid prototyping. As simple a possible state is maintained, with an opinionated stack:

1. Use of `pnpm` for package management.
2. Use of `sveltekit` for CSR and routing.
3. Use of `vite` for bundling.