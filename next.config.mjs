/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
      return [
        {
          source: "/api/socket",
          headers: [
            {
              key: "Connection",
              value: "Upgrade"
            },
            {
              key: "Upgrade",
              value: "websocket"
            }
          ]
        }
      ];
    }
  };
  
  export default nextConfig;
  