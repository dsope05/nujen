/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    SITE_KEY: process.env.SITE_KEY,
    ENV: process.env.ENV,
    CAPTCHA_URL: process.env.CAPTCHA_URL,
    NEXT_PUBLIC_AIRTABLE_API_KEY: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
    NEXT_PUBLIC_AIRTABLE_BASE_ID: process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID,
    NEXT_PUBLIC_AIRTABLE_TABLE_ID: process.env.NEXT_PUBLIC_AIRTABLE_TABLE_ID,
  }
}

module.exports = nextConfig
