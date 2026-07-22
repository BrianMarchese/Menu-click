import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com'
            },
            {
                protocol: 'https',
                hostname: 'statics.dinoonline.com.ar'
            },
            {
                protocol: 'https',
                hostname: 'www.coca-cola.com' 
            },
            {
                protocol: 'https',
                hostname: '*.supabase.co',
            },
        ]
    }
};

export default nextConfig;
