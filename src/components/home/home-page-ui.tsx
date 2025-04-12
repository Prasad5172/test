"use client";
import "./home-css.css";

export default function HomePage() {
  return (
    <div>
      <div className="container relative mx-auto h-[calc(100dvh-120px)] overflow-hidden">
        <div className="space-y- px-5 sm:px-10 sm:py-3 fixed h-[calc(100%-150px)]  w-[90%] overflow-y-scroll scrollbar-hide top-[50%] left-1/2 transform -translate-x-1/2 -translate-y-[48%] bg-[#202020] rounded-[10px]">
          <div className="header text-justify" id="myHeader">
            <p className="text-red-600 leading-4 md:leading-5 mx-1 mt-4 mb-2 text-[70%] md:text-[100%]">
              NOTE: Please read the instructions given below, which helps to
              make underdstanding of the protocol. If any issues or collabrating
              with projects please contact through Email or LinkedIn. This
              exchange only works on `devnet`.
            </p>
          </div>
          <div><br />
            <h3 className="font-bold">1) View Pools</h3>
            <ul  className="list-disc list-inside funtion-process">
              <li>
                 You can see the current trading pools on the protocol
                with the Mint-A & Mint-B token address, fees, liquidity in the
                pool and Mint-A & Mint-B total amount deposited in the pool.
              </li>
            </ul>
          </div>
          <div><br />
            <h3 className="font-bold">2) Create Pools</h3>
            <ul className="list-disc list-inside funtion-process">
              <li>Any trader can create pool with two unique tokens.</li>
              <li>
                Mint-A address should be greater than the Mint-B address.
              </li>
              <li>
                To create a pool user have to pay 0.1 SOL to the pool
                admin. There is no need to add initial liquidity to the pool
                while creating.
              </li>
              <li>
                Trading on exchange is works on single hop swap exchange,
                tarders cannot swap, add or remove liquidity when the pool is
                not exists.
              </li>
              <li>
                User have to select any one of the fee tier to create
                pool with two uniqe tokens. With any two tokens any one can
                create only single pool even though having mutiple fee tiers.
              </li>
              <li>
                Trading pool is works on principle of Automated Market
                Maker(AMM), x * y = k
              </li>
            </ul>
          </div>
          <div><br />
            <h3 className="font-bold">3) Add Liquidity</h3>
            <ul className="list-disc list-inside funtion-process">
              <li>
                At initial liquidity the pool takes 100 liquidity tokens
                to avoid inflation attacks.
              </li>
              <li>
                Traders have to select fees correctly, if the fees withe
                the selected tokens are not exists the adding of liquidity will
                fails.
              </li>
              <li>
                Liquidity providers can add liquidity even in an unequal
                ratio compared to the existing pools token balances. The
                protocol automatically swaps the excess tokens on a DEX (like
                Raydium) to balance the ratio and adds the full amount to the
                pool.
              </li>
              <i>Example </i>
              <div className="text-left p-4 text-justify italic backdrop-blur-md rounded-lg bg-[#ffffff0f]">
                <p>
                  A liquidity pool contains: Token-A: 100 units Token-B: 200
                  units The pool follows a constant ratio (1:2 ratio) between
                  Token-A and Token-B.
                </p>
                <p>
                  A liquidity provider (LP) wants to add liquidity but provides
                  tokens in a different ratio: Token-A: 50 units Token-B: 300
                  units(1:6 ratio).
                </p>
                <p>
                  The protocol uses Raydium DEX to swap the excess Token-B into
                  Token-A.
                </p>
                <p>
                  At initial we take Token-A: 50 units and Token-B: 100 units
                  with respective to pool balance ratios.
                </p>
                <p>
                  With the excess Token-B amount of 200 units we divide with 3
                  units(1+2), with that we swap Token-A with the 1 ratio amount
                  of exceed 200 Units.
                </p>
                <p>
                  i.e, 66.6 Token-B units are swapped to Token-A in Raydium DEX
                  by calculating fees.
                </p>
                <p>
                  After swapping the total Amount-A: 116.6 and Amount-B:
                  233.4(1:2 ration) tokens of liquidity is added
                </p>
              </div>
              <li>
                This feature makes easy to add any ratio amount of
                liquidity to the pool.
              </li>
            </ul>
          </div>
          <div><br />
            <h3 className="font-bold">4) Remove Liquidity</h3>
            <ul className="list-disc list-inside funtion-process">
              <li>
                Trader will get all the swap fees of the pool. Adding and
                Removing liquidity works based on the minting and burning of
                shares.(ERC-4626 vault)
              </li>
              <li>
                Trader have to select correct fees and tokens to withdraw
                liquidity.
              </li>
              <li>
                There is no liquidity fees is collected during adding and
                removing of liquidity tokens.
              </li>
            </ul>
          </div>
          <div className="text-justify"><br />
            <h3 className="font-bold">5) Swap Tokens(Exact Input & Exact Output)</h3>
            <ul className="list-disc list-inside funtion-process">
              <li>
                User have to select the correct tokens and fee tier, only
                the pool which exists with that fees and tokens only swap will
                executes.
              </li>
              <li>
                User can select the price slippage tolerance to swap the
                tokens within the selected price ranges, It is set by users to
                prevent trades from completing if market conditions or liquidity
                cause prices to deviate beyond this threshold.
              </li>
              <li>
                User can swap tokens with exact input amount or exact
                output amount by jsut changing the input values.
              </li>
              <li>
                Users can see the output amount they can get based on the
                current liquidity in the pool.
              </li>
              <li>
                User have to enter the amount with the entier decimal of
                the token.{" "}
              </li>
              <li>
                Example : If the Token-A decimal is 9, then usser want to
                swap 5 Token-A amount, then user want to enter 5_000_000_000 in
                input field, and out amount also displayed with the decimal
                values.
              </li>
              <li>
                Swapping prices are calculated by charging fees of that
                respective pool with securely which makes avoild the rounding
                issues while calculating.
              </li><br />
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
