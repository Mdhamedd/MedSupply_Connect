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
    ],
  },
};

export default nextConfig;
