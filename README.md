# RCR-DEX Solana

### Installation

#### Website

```shell
https://rcrdex.netlify.app/
```

#### Structure
```shell
Directory structure:
└── ramachandrareddy352-solana-dex-full-stack/
    ├── .github/
    │   └── workflows/
    │       ├── test-web.yml
    │       └── test-anchor.yml
    ├── next.config.mjs
    ├── .eslintrc.json
    ├── public/
    │   └── token.webp
    ├── package.json
    ├── postcss.config.mjs
    ├── tailwind.config.ts
    ├── LICENSE
    ├── tsconfig.json
    ├── README.md
    ├── pnpm-lock.yaml
    ├── anchor/
    │   ├── .prettierignore
    │   ├── tests/
    │   │   └── rcr_dex_test.spec.ts
    │   ├── Cargo.toml
    │   ├── .gitignore
    │   ├── migrations/
    │   │   └── deploy.ts
    │   ├── Anchor.toml
    │   ├── programs/
    │   │   └── rcr_dex/
    │   │       ├── Xargo.toml
    │   │       ├── Cargo.toml
    │   │       └── src/
    │   │           ├── state.rs
    │   │           ├── errors.rs
    │   │           ├── lib.rs
    │   │           ├── constants.rs
    │   │           ├── utils.rs
    │   │           └── instructions/
    │   │               ├── swap_exact_input.rs
    │   │               ├── create_amm.rs
    │   │               ├── create_pool.rs
    │   │               ├── withdraw_liquidity.rs
    │   │               ├── change_amm_admin.rs
    │   │               ├── deposit_liquidity.rs
    │   │               ├── mod.rs
    │   │               └── swap_exact_output.rs
    │   ├── tsconfig.json
    │   ├── target/
    │   │   ├── idl/
    │   │   │   └── rcr_dex.json
    │   │   └── types/
    │   │       └── rcr_dex.ts
    │   ├── Cargo.lock
    │   └── src/
    │       ├── dex-exports.ts
    │       └── index.ts
    └── src/
        ├── components/
        │   ├── swap/
        │   │   ├── swap-mutation.tsx
        │   │   └── swap-ui.tsx
        │   ├── solana/
        │   │   └── solana-provider.tsx
        │   ├── ui/
        │   │   └── ui-layout.tsx
        │   ├── pools/
        │   │   ├── pool-ui.tsx
        │   │   ├── create-pools.tsx
        │   │   ├── pool-mutation.tsx
        │   │   └── view-pools.tsx
        │   ├── cluster/
        │   │   ├── cluster-data-access.tsx
        │   │   └── cluster-ui.tsx
        │   ├── liquidity/
        │   │   ├── liquidity-ui.tsx
        │   │   ├── data-mutaion.tsx
        │   │   ├── remove-liquidity.tsx
        │   │   └── add-liquidity.tsx
        │   ├── data-access/
        │   │   ├── account-ui.tsx
        │   │   └── account-data-access.tsx
        │   └── home/
        │       ├── home-page-ui.tsx
        │       └── home-css.css
        └── app/
            ├── api/
            │   └── hello/
            │       └── route.ts
            ├── page.tsx
            ├── globals.css
            ├── swap/
            │   └── page.tsx
            ├── pools/
            │   └── page.tsx
            ├── liquidity/
            │   └── page.tsx
            ├── layout.tsx
            └── react-query-provider.tsx
```

#### Clone the repo

```shell
git clone https://github.com/ramachandrareddy352/solana-dex-full-stack
cd solana-dex-full-stack
```

#### Install Dependencies

```shell
pnpm install
```

#### Start the web app

```shell
pnpm dev
```

#### Build the web app

```shell
pnpm build
```
### App 
```shell
1) View Pools
-> You can see the current trading pools on the protocol with the Mint-A & Mint-B token address, fees, liquidity in the pool and Mint-A & Mint-B total amount deposited in the pool.

2) Create Pools
-> Any trader can create pool with two unique tokens.

-> Mint-A address should be greater than the Mint-B address.

-> To create a pool user have to pay 0.1 SOL to the pool admin. There is no need to add initial liquidity to the pool while creating.

-> Trading on exchange is works on single hop swap exchange, tarders cannot swap, add or remove liquidity when the pool is not exists.

-> User have to select any one of the fee tier to create pool with two uniqe tokens. With any two tokens any one can create only single pool even though having mutiple fee tiers.

-> Trading pool is works on principle of Automated Market Maker(AMM), x * y = k

3) Add Liquidity
-> At initial liquidity the pool takes 100 liquidity tokens to avoid inflation attacks.

-> Traders have to select fees correctly, if the fees withe the selected tokens are not exists the adding of liquidity will fails.

-> Liquidity providers can add liquidity even in an unequal ratio compared to the existing pools token balances. The protocol automatically swaps the excess tokens on a DEX (like Raydium) to balance the ratio and adds the full amount to the pool.

-> Example

A liquidity pool contains: Token-A: 100 units Token-B: 200 units The pool follows a constant ratio (1:2 ratio) between Token-A and Token-B.

A liquidity provider (LP) wants to add liquidity but provides tokens in a different ratio: Token-A: 50 units Token-B: 300 units(1:6 ratio).

The protocol uses Raydium DEX to swap the excess Token-B into Token-A.

At initial we take Token-A: 50 units and Token-B: 100 units with respective to pool balance ratios.

With the excess Token-B amount of 200 units we divide with 3 units(1+2), with that we swap Token-A with the 1 ratio amount of exceed 200 Units.

i.e, 66.6 Token-B units are swapped to Token-A in Raydium DEX by calculating fees.

After swapping the total Amount-A: 116.6 and Amount-B: 233.4(1:2 ration) tokens of liquidity is added

->This feature makes easy to add any ratio amount of liquidity to the pool.

4) Remove Liquidity
-> Trader will get all the swap fees of the pool. Adding and Removing liquidity works based on the minting and burning of shares.(ERC-4626 vault)

-> Trader have to select correct fees and tokens to withdraw liquidity.

-> There is no liquidity fees is collected during adding and removing of liquidity tokens.

5) Swap Tokens(Exact Input & Exact Output)
-> User have to select the correct tokens and fee tier, only the pool which exists with that fees and tokens only swap will executes.

-> User can select the price slippage tolerance to swap the tokens within the selected price ranges, It is set by users to prevent trades from completing if market conditions or liquidity cause prices to deviate beyond this threshold.

-> User can swap tokens with exact input amount or exact output amount by jsut changing the input values.

-> Users can see the output amount they can get based on the current liquidity in the pool.

-> User have to enter the amount with the entier decimal of the token.

-> Example : If the Token-A decimal is 9, then usser want to swap 5 Token-A amount, then user want to enter 5_000_000_000 in input field, and out amount also displayed with the decimal values.

-> Swapping prices are calculated by charging fees of that respective pool with securely which makes avoild the rounding issues while calculating.
```
