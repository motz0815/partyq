/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "i.ytimg.com",
            }
        ],
    },
}

export default nextConfig
