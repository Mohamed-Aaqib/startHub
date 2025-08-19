import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  "images":{
    remotePatterns:[
      {
        protocol:"https",
        hostname:"ichef.bbci.co.uk",
        pathname:"/**"
      }
    ]
  }
};

export default nextConfig;
