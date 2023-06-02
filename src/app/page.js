"use client";

import { useEffect, useState } from "react";

function formatDateTime(date) {
  const d = new Date(date);

  // padStart is used to add leading zeroes when needed
  let day = d.getDate().toString().padStart(2, "0");
  let month = (d.getMonth() + 1).toString().padStart(2, "0"); // Month is 0 based, so adding 1
  let year = d.getFullYear().toString().slice(2, 4); // get last two digits of the year
  let hours = d.getHours().toString().padStart(2, "0");
  let minutes = d.getMinutes().toString().padStart(2, "0");
  let seconds = d.getSeconds().toString().padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

export default function Home() {
  const [data, setData] = useState();

  const fetchData = async () => {
    const res = await fetch("/api/update", {
      method: "POST",
      next: { revalidate: 0 },
    });
    const data = await res.json();
    setData(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = async () => {
    await fetchData();
  };

  return (
    <main className="flex flex-col items-center justify-center p-0 lg:p-24 bg-slate-600 dark:bg-slate-600">
      <div className="mx-auto p-0 lg:p-6 flex flex-col justify-center items-center">
        <div className="bg-slate-600 rounded-md p-6 w-screen lg:w-auto">
          <div className="flex items-center justify-evenly w-full">
            <button
              className="bg-slate-900 hover:bg-slate-500 text-white font-bold py-4 px-4 rounded-full"
              onClick={handleRefresh}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
            </button>
            {data && (
              <div className="flex flex-row justify-between items-center w-full">
              <span className="text-slate-600 text-[8px] font-bold p-2 ml-4 rounded-md bg-emerald-100">
                {formatDateTime(data.date)}
              </span>
              <span className="ml-6 p-2 bg-slate-700 text-green-400 font-bold text-sm rounded-lg relative">
              <span className="absolute text-[8px] leading-3 lett text-white bg-slate-800 rounded-lg top-[-15px] left-[-20px] p-1 px-2">
                liquidity
              </span>
              ${data.totalLiquidity}
            </span>
            </div>
            )}
          </div>
          {data ? (
            <div className="m-4 lg:m-6">
              <div className="flex flex-row justify-between items-center my-10 border-b-2 pb-5">
                <span className="p-2 bg-slate-700 text-green-400 font-bold text-sm rounded-lg relative">
                  <span className="absolute text-[8px] leading-3 lett text-white bg-slate-800 rounded-lg top-[-15px] left-[-20px] p-1 px-2">
                    Pooled USDC
                  </span>
                  ${data.usdcPool}
                </span>
                <span className="p-2 bg-slate-700 text-green-400 font-bold text-sm rounded-lg relative">
                  <span className="absolute text-[8px] leading-3 lett text-white bg-slate-800 rounded-lg top-[-15px] left-[-20px] p-1 px-2">
                    Pooled WETH
                  </span>
                  {data.wethPool}
                </span>
                <span className="p-2 bg-slate-700 text-green-400 font-bold text-sm rounded-lg relative">
                  <span className="absolute text-[8px] leading-3 lett text-white bg-slate-800 rounded-lg top-[-15px] left-[-20px] p-1 px-2">
                    WETH in USDC
                  </span>
                  ${data.wethPoolToUSDC}
                </span>
              </div>
              <div className="flex flex-row lg:flex-row justify-between items-center m-auto mt-10 mb-5 border-b-2 pb-5">
                <span className="p-2 bg-slate-700 text-green-400 font-bold text-sm rounded-lg relative">
                  <span className="absolute text-[8px] leading-3 text-white bg-slate-800 rounded-lg top-[-15px] left-[-20px] p-1 px-2">
                    lower
                  </span>
                  ${data.tickUpperUSD}
                </span>
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4 m-2 text-emerald-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
                    />
                  </svg>
                </span>
                <span className="p-2 bg-slate-700 text-green-400 font-bold text-sm rounded-lg relative">
                  <span className="absolute text-[8px] leading-3 lett text-white bg-slate-800 rounded-lg top-[-15px] left-[-20px] p-1 px-2">
                    prezzo
                  </span>
                  ${data.currentTickUSD}
                </span>
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4 m-2 text-emerald-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </span>
                <span className="p-2 bg-slate-700 text-green-400 font-bold text-sm rounded-lg relative">
                  <span className="absolute text-[8px] leading-3 lett text-white bg-slate-800 rounded-lg top-[-15px] left-[-20px] p-1 px-2">
                    upper
                  </span>
                  ${data.tickLowerUSD}
                </span>
              </div>
              <div className="m-auto mb-2">
                <h3 className="text-white mb-5">Rewards</h3>
                <div className="flex flex-col justify-between items-center">
                  <div className="border-b-2 pb-5 flex flex-row justify-between w-full mb-8">
                    <span className="p-2 bg-slate-700 text-green-400 font-bold text-sm rounded-lg relative">
                      <span className="absolute text-[8px] leading-3 lett text-white bg-slate-800 rounded-lg top-[-15px] left-[-20px] p-1 px-2">
                        usd
                      </span>
                      ${data.usdcFees}
                    </span>
                    <span className="p-2 bg-slate-700 text-green-400 font-bold text-sm rounded-lg relative">
                      <span className="absolute text-[8px] leading-3 lett text-white bg-slate-800 rounded-lg top-[-15px] left-[-20px] p-1 px-2">
                        weth
                      </span>
                      {parseFloat(data.wethFees).toFixed(5)}
                    </span>
                    <span className="p-2 bg-slate-700 text-green-400 font-bold text-sm rounded-lg relative">
                      <span className="absolute text-[8px] leading-3 lett text-white bg-slate-800 rounded-lg top-[-15px] left-[-20px] p-1 px-2">
                        weth in usd
                      </span>
                      ${data.wethinusdfees}
                    </span>
                  </div>
                  <span className="p-2 bg-slate-700 text-green-400 font-bold text-4xl rounded-lg relative">
                    <span className="absolute text-sm leading-3 lett text-white bg-slate-800 rounded-lg top-[-18px] left-[-20px] p-2 px-3">
                      total
                    </span>
                    ${data.totalFees}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </main>
  );
}
