/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "i.ytimg.com",
            },
            {
                hostname: "is2-ssl.mzstatic.com",
            }
        ],
    },
}

export default nextConfig
