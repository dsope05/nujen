/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    SITE_KEY: process.env.SITE_KEY,
    ENV: process.env.ENV,
    CAPTCHA_URL: process.env.CAPTCHA_URL,
  }
}

module.exports = nextConfig
