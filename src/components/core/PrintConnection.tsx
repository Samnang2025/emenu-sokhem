"use client";
import { useEffect } from "react";
import { connectWS } from "@/helper/directPrint";

export default function PrintConnection() {
  useEffect(() => {
    connectWS();
  }, []);

  return null;
}
