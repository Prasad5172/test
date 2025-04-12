"use client";

// Next, React
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { createQR } from "@solana/pay";

const SOLANA_PAY_URL = "solana:https://rcrdex.netlify.app/api/hello";

export default function Page() {
  const qrRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const qr = createQR(SOLANA_PAY_URL, 360, "white", "black");

    // Set the generated QR code on the QR ref element
    if (qrRef.current) {
      qrRef.current.innerHTML = "";
      qr.append(qrRef.current);
      console.log("appended");
    }
  }, []);

  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <div className="mt-6">
          <h1 className="text-center text-5xl md:pl-12 font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mb-4">
            Scan this:
          </h1>
          <div ref={qrRef || null} />
        </div>
      </div>
    </div>
  );
}
