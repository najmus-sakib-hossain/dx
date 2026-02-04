import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  turbopack: {
    rules: {
      // Handle .glb and .gltf 3D model files
      '*.glb': {
        loaders: ['file-loader'],
        as: '*.js',
      },
      '*.gltf': {
        loaders: ['file-loader'],
        as: '*.js',
      },
    },
  },
};

export default nextConfig;
