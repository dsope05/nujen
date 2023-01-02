/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    SITE_KEY: process.env.SITE_KEY,
    ENV: process.env.ENV,
  }
}

module.exports = nextConfig
