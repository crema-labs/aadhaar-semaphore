import "@/styles/globals.css";
import type { AppProps } from "next/app";
import React, { useEffect, useState } from "react";
import { AnonAadhaarProvider } from "@anon-aadhaar/react";

type ArtifactsLinks = {
  zkey_url: string;
  wasm_url: string;
  vkey_url: string;
};

export default function App({ Component, pageProps }: AppProps) {
  const [ready, setReady] = useState<boolean>(false);

  useEffect(() => {
    setReady(true);
  }, []);

  // const links: ArtifactsLinks = {
  //   wasm_url: "aadhaar-verifier.wasm",
  //   zkey_url: "circuit_final.zkey",
  //   vkey_url: "vkey.json",
  // };
  // _artifactslinks={links}
  return (
    <>
      {ready ? (
        <AnonAadhaarProvider _appName="Anon Aadhaar">
          <Component {...pageProps} />
        </AnonAadhaarProvider>
      ) : null}
    </>
  );
}
