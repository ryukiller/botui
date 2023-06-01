"use server";
import { NextResponse } from "next/server";
// const dotenv = require("dotenv");
// dotenv.config();
import JSBI from "jsbi";
import { TickMath, FullMath } from "@uniswap/v3-sdk";
import { ethers, BigNumber } from "ethers";
const {
  abi: IUniswapV3PoolABI,
} = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json");
const {
  abi: INonfungiblePositionManagerABI,
} = require("@uniswap/v3-periphery/artifacts/contracts/interfaces/INonfungiblePositionManager.sol/INonfungiblePositionManager.json");
const NftPosAbi = require("../../../abi/NftPositionsAbi.json");

const RPC_URL = process.env.ALCHEMY;

const botAddr = "0xf9579E3ce6D77a23Aa1020Bf495ed04A40a9080f";

const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

const poolAddress = "0x45dda9cb7c25131df268515131f647d726f50608"; // WETH-USDC pool address
const poolContract = new ethers.Contract(
  poolAddress,
  IUniswapV3PoolABI,
  provider
);

const positionManager = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";
const NftContract = new ethers.Contract(
  positionManager, // Position Manager
  NftPosAbi,
  provider
);

async function getLastPositionId(address) {
  const nftsIndex = await NftContract.balanceOf(address);
  if (nftsIndex > 0) {
    const nftId = await NftContract.tokenOfOwnerByIndex(address, nftsIndex - 1);
    return nftId;
  } else {
    return null;
  }
}

async function getCurrentTick() {
  // get the current tick and return it
  const { tick, sqrtPriceX96 } = await poolContract.slot0();
  return { tick: tick, sqrtPriceX96: sqrtPriceX96 };
}

const calculatePendingFees = async (tokenId) => {
  try {
    const params = {
      tokenId: tokenId,
      recipient: botAddr,
      amount0Max: BigNumber.from(2).pow(128).sub(1),
      amount1Max: BigNumber.from(2).pow(128).sub(1),
    };

    const feesGenerated = await NftContract.callStatic.collect(params);
    return feesGenerated;
  } catch (error) {
    console.log(error.message, "calculate fees error");
  }
};

async function getPosInfo(nftid) {
  return NftContract.positions(nftid).then((res) => {
    return {
      tickLower: res.tickLower,
      tickUpper: res.tickUpper,
      liquidity: res.liquidity,
    };
  });
}

function tickToUSDC(tick) {
  const sqrtRatioX96 = TickMath.getSqrtRatioAtTick(tick);
  const ratioX192 = JSBI.multiply(sqrtRatioX96, sqrtRatioX96);
  const baseAmount = JSBI.BigInt(1 * 10 ** 6);
  const shift = JSBI.leftShift(JSBI.BigInt(1), JSBI.BigInt(192));
  const quote = FullMath.mulDivRoundingUp(ratioX192, baseAmount, shift);
  const tickPrice = 10 ** 18 / quote.toString();

  return tickPrice.toFixed(2);
}

const Q96 = JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(96));

async function getTokenAmounts(
  liquidity,
  sqrtPriceX96,
  tickLow,
  tickHigh,
  Decimal0,
  Decimal1,
  currentTick
) {
  let sqrtRatioA = Math.sqrt(Math.pow(1.0001, tickLow));
  let sqrtRatioB = Math.sqrt(Math.pow(1.0001, tickHigh));

  let sqrtPrice =
    parseFloat(sqrtPriceX96.toString()) / parseFloat(Q96.toString());

  let amount0wei = 0;
  let amount1wei = 0;
  if (currentTick <= tickLow) {
    amount0wei = Math.floor(
      liquidity * ((sqrtRatioB - sqrtRatioA) / (sqrtRatioA * sqrtRatioB))
    );
  } else if (currentTick > tickHigh) {
    amount1wei = Math.floor(liquidity * (sqrtRatioB - sqrtRatioA));
  } else if (currentTick >= tickLow && currentTick < tickHigh) {
    amount0wei = Math.floor(
      liquidity * ((sqrtRatioB - sqrtPrice) / (sqrtPrice * sqrtRatioB))
    );
    amount1wei = Math.floor(liquidity * (sqrtPrice - sqrtRatioA));
  }

  let amount0Human = Math.abs(amount0wei / Math.pow(10, Decimal0)).toFixed(
    Decimal0
  );
  let amount1Human = Math.abs(amount1wei / Math.pow(10, Decimal1)).toFixed(
    Decimal1
  );

  return { amount0Human: amount0Human, amount1Human: amount1Human };
}

export async function POST(req) {
  const nftID = await getLastPositionId(botAddr);
  const { tick: currentTick, sqrtPriceX96 } = await getCurrentTick();
  const currentTickUSD = tickToUSDC(currentTick);
  const fees = await calculatePendingFees(nftID);
  //console.log(fees);
  const usdcFees = ethers.utils.formatUnits(fees.amount0.toString(), 6);
  const wethFees = ethers.utils.formatUnits(fees.amount1.toString(), 18);
  const wethinusdfees = wethFees * currentTickUSD;
  const totalFees =
    parseFloat(wethFees * currentTickUSD) + parseFloat(usdcFees);

  const poolInfo = await getPosInfo(nftID);
  const date = new Date();

  const { amount0Human: usdcPool, amount1Human: wethPool } =
    await getTokenAmounts(
      poolInfo.liquidity,
      sqrtPriceX96,
      poolInfo.tickLower,
      poolInfo.tickUpper,
      6,
      18,
      currentTick
    );

  const data = {
    date: date,
    lastPosId: nftID.toString(),
    currentTick: currentTick,
    currentTickUSD: currentTickUSD,
    usdcFees: parseFloat(usdcFees).toFixed(2),
    wethFees: wethFees,
    wethinusdfees: parseFloat(wethinusdfees).toFixed(2),
    totalFees: parseFloat(totalFees).toFixed(2),
    tickLower: poolInfo.tickLower.toString(),
    tickUpper: poolInfo.tickUpper.toString(),
    liquidity: poolInfo.liquidity.toString(),
    tickLowerUSD: tickToUSDC(poolInfo.tickLower),
    tickUpperUSD: tickToUSDC(poolInfo.tickUpper),
    usdcPool: parseFloat(usdcPool).toFixed(2),
    wethPool: parseFloat(wethPool).toFixed(5),
    wethPoolToUSDC: parseFloat(wethPool * currentTickUSD).toFixed(2),
  };
  return NextResponse.json(data);
}
