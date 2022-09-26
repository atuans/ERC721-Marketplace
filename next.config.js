/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
        INFURA_IPFS_PROJECT_ID: process.env.INFURA_IPFS_PROJECT_ID,
        INFURA_IPFS_PROJECT_SECRET: process.env.INFURA_IPFS_PROJECT_SECRET,
    },
  swcMinify: true,
    images:{
      domains: [
        'lh3.googleusercontent.com',
        'openseauserdata.com',
        'brand.assets.adidas.com',
        'media0.giphy.com',
        'avatars.dicebear.com',
        'media1.giphy.com',
        'media3.giphy.com',
        'media2.giphy.com',
        'media4.giphy.com',
        'img.rarible.com',
        'ipfs.moralis.io'
      ],
    }
}

module.exports = nextConfig
