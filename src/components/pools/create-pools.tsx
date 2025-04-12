"use client";

import React, { useState } from "react";
import { useDexProgram } from "./pool-mutation";
import { message } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

export function CreatePools() {
  const [formData, setFormData] = useState({
    tokenA: "",
    tokenB: "",
    fee: 30,
  });
  const { createPoolMutation } = useDexProgram();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.tokenA.length != 44 || formData.tokenB.length != 44) {
      message.error("Enter valid length of token mints");
      return;
    } else {
      await createPoolMutation
        .mutateAsync({
          mintA: formData.tokenA,
          mintB: formData.tokenB,
          fees: formData.fee,
        })
        .then((data) => {
          console.log("Pool created successfully!");
          console.log("Response data:", data); // Log the returned data
          formData.tokenA = "";
          formData.tokenB = "";
          formData.fee = 30;
        });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "radio" ? Number(value) : value, // Convert radio button value to a number
    }));
    if (type === "radio") {
      formData.fee = Number(value);
    }
  };

  return (
    <div className="container  py-3 text-white">
      <div
        className="bg-zinc-900 p-2 px-1 sm:p-4 sm:px-6 rounded-xl my-2 text-white mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-bold">Create Liquidity Pool</h1>
        </div>

        <form className="space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="tokenA"
                className="block text-sm font-medium my-3"
              >
                Mint-A Address
              </label>
              <input
                type="text"
                id="tokenA"
                name="tokenA"
                value={formData.tokenA}
                onChange={handleInputChange}
                placeholder="Enter ERC20 address"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-[#212429]"
                required
              />
            </div>
            <br />

            <div>
              <label
                htmlFor="tokenB"
                className="block text-sm font-medium my-3"
              >
                Mint-B Address
              </label>
              <input
                type="text"
                id="tokenB"
                name="tokenB"
                value={formData.tokenB}
                onChange={handleInputChange}
                placeholder="Enter ERC20 address"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-[#212429]"
                required
              />
            </div>
          </div>

          <fieldset>
            <legend className="text-sm font-medium text-grey-700 mb-2">
              Pool Fee
            </legend>
            <div className="grid grid-cols-3 gap-3">
              {[10, 30, 100].map((fee) => (
                <div key={fee} className="relative">
                  <input
                    type="radio"
                    id={`fee-${fee}`}
                    name="fee" // Ensure the name matches the state key
                    value={fee}
                    checked={formData.fee === fee}
                    onChange={handleInputChange}
                    className="peer hidden"
                  />
                  <label
                    htmlFor={`fee-${fee}`}
                    className="flex items-center justify-center px-4 py-2 border rounded-lg cursor-pointer text-gray-700 bg-white hover:bg-gray-50 peer-checked:bg-indigo-50 peer-checked:border-indigo-600 peer-checked:text-indigo-600 transition-all"
                    style={{
                      backgroundColor: `${formData.fee === fee ? `grey` : ``}`,
                    }}
                  >
                    {fee / 100}&nbsp;%
                  </label>
                </div>
              ))}
            </div>
          </fieldset>
          <p>
            <InfoCircleOutlined /> No two tokens can create multiple pools even
            having multiple fees.
          </p>

          {createPoolMutation.isPending ? (
            <div style={{ marginLeft: "45%" }}>
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <button
              type="button"
              className="flex btn btn-outline-primary my-5"
              style={{
                width: "100%",
                backgroundColor: "white",
                color: "black",
                fontSize: "20px",
              }}
              onClick={handleSubmit}
            >
              Create Pool
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
