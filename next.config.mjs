/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "i.scdn.co",
      "cdn0.iconfinder.com",
      "cdn1.iconfinder.com",
      "cdn2.iconfinder.com",
      "cdn3.iconfinder.com",
      "cdn4.iconfinder.com",
      "cdn5.iconfinder.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "",
      },
    ],
  },
};

export default nextConfig;
