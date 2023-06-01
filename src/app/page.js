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
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gray-100">
      <div className="container mx-auto p-6">
        <div className="bg-white shadow-md rounded-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Uniswap Pool View</h1>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleRefresh}
            >
              Refresh
            </button>
          </div>
          {data ? (
            <div className="grid grid-cols-2 gap-6">
              {Object.entries(data).map(([key, value]) => (
                <div className="bg-white shadow-md rounded p-4" key={key}>
                  <h2 className="text-lg font-bold mb-2">{key}</h2>
                  <p className="text-gray-600">{value}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </main>
  );
}
