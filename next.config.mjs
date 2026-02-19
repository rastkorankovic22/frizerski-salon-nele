/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/zakazivanje', destination: '/booking', permanent: true },
    ];
  },
};

export default nextConfig;