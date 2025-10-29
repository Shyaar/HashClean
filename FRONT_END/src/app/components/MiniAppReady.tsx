"use client";

import { useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

export default function MiniAppReady(): null {
  useEffect(() => {
    // guard in case sdk isn't available (running outside Base app)
    try {
      if (sdk && sdk.actions && typeof sdk.actions.ready === "function") {
        sdk.actions.ready();
        // Optional: use console or analytics event to confirm ready called
        console.log("Farcaster miniapp sdk.actions.ready() called");
      } else {
        console.log("Farcaster miniapp SDK not available in this environment.");
      }
    } catch (err) {
      console.warn("Error calling sdk.actions.ready():", err);
    }
  }, []);

  return null;
}