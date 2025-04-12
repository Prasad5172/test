"use client";

import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

import { redirect } from "next/navigation";
import { WalletButton } from "../solana/solana-provider";

import { CreatePools } from "./create-pools";
import { ViewPools } from "./view-pools";
import { EyeOutlined, PlusCircleOutlined } from "@ant-design/icons";
// in pool as like add & remove liquidty add all listed pools and create pool
export default function Pools() {
  const { publicKey } = useWallet();

  const [activeTab, setActiveTab] = useState<"add" | "remove">("add");

  return publicKey ? (
    <div className=" from-blue-50 to-indigo-50 flex items-center justify-center p-4 lg:pb-0 text-white w-[100%] md:w-[800px] mx-auto h-calc(100vh-135px) relative mb-[15px] lg:mb-0">
      <div className="w-full">
        <div className="bg-black rounded-xl shadow-lg p-1">
          <div className="flex flex-col md:flex-row md:w-[100%]">
            <button
              onClick={() => setActiveTab("add")}
              className={`py-2 px-4 rounded-lg font-medium transition-colors m-1 md:w-1/2 ${
                activeTab === "add"
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-700 hover:text-gray-300"
              }`}
              style={{ border: "white solid 1px" }}
            >
              Create Pool &nbsp;&nbsp; <PlusCircleOutlined />
            </button>
            <button
              onClick={() => setActiveTab("remove")}
              className={`py-2 px-4 rounded-lg font-medium transition-colors m-1 md:w-1/2  ${
                activeTab === "remove"
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-700 hover:text-gray-300"
              }`}
              style={{ border: "white solid 1px" }}
            >
              View Pools &nbsp;&nbsp; <EyeOutlined />
            </button>
          </div>
        </div>

        {activeTab === "add" ? <CreatePools /> : <ViewPools />}
      </div>
    </div>
  ) : (
    <div className="max-w-4xl mx-auto">
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <WalletButton />
        </div>
      </div>
    </div>
  );
}
