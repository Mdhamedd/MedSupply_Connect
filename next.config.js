/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337", // مهم لو السيرفر بيشتغل على بورت معين
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;

// ## The Solution

// You need to add "images.unsplash.com" to the list of allowed hostnames in your Next.js configuration. Here's how to update your `next.config.js` file:
