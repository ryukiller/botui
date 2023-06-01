"use client";
import { useState, useEffect } from "react";

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
    <main className="flex min-h-screen flex-col items-center justify-between p-0 lg:p-24 bg-gray-100 dark:bg-slate-900">
      <div className="mx-auto p-0 lg:p-6">
        <div className="dark:bg-slate-700 bg-slate-600 shadow-md rounded-md p-6 w-screen lg:w-auto">
          <div className="flex items-center justify-between mb-6">
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
          </div>
          {data ? (
            <div className="m-4 lg:m-6">
              <div className="flex flex-col lg:flex-row justify-between items-center m-auto mt-10 mb-10">
                <span className="p-2 bg-slate-700 text-green-400 font-bold text-lg rounded-lg relative">
                  <span className="absolute text-[8px] leading-3 lett text-white bg-slate-800 rounded-lg top-[-15px] left-[-20px] p-1 px-2">
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
                    className="w-8 h-8 m-6 text-emerald-400 rotate-90 lg:rotate-0"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
                    />
                  </svg>
                </span>
                <span className="p-2 bg-slate-700 text-green-400 font-bold text-lg rounded-lg relative">
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
                    className="w-8 h-8 m-6 text-emerald-400 rotate-90 lg:rotate-0"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </span>
                <span className="p-2 bg-slate-700 text-green-400 font-bold text-lg rounded-lg relative">
                  <span className="absolute text-[8px] leading-3 lett text-white bg-slate-800 rounded-lg top-[-15px] left-[-20px] p-1 px-2">
                    upper
                  </span>
                  ${data.tickLowerUSD}
                </span>
              </div>
              <div className="m-auto mb-10 mt-18">
                <h3 className="text-white mb-12">Rewards</h3>
                <div className="flex flex-row justify-between items-center">
                  <div className="flex flex-col justify-between min-h-[220px]">
                    <span className="p-2 bg-slate-700 text-green-400 font-bold text-lg rounded-lg relative">
                      <span className="absolute text-[8px] leading-3 lett text-white bg-slate-800 rounded-lg top-[-15px] left-[-20px] p-1 px-2">
                        usd
                      </span>
                      ${data.usdcFees}
                    </span>
                    <span className="p-2 bg-slate-700 text-green-400 font-bold text-lg rounded-lg relative">
                      <span className="absolute text-[8px] leading-3 lett text-white bg-slate-800 rounded-lg top-[-15px] left-[-20px] p-1 px-2">
                        weth
                      </span>
                      ${parseFloat(data.wethFees).toFixed(5)}
                    </span>
                    <span className="p-2 bg-slate-700 text-green-400 font-bold text-lg rounded-lg relative">
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
