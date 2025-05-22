const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "7d7ce4d2fd579ab1db8f-ff847b6fa91c3461c76d26fad16823fb.ssl.cf1.rackcdn.com",
      "safe-images-cdn.drund.com",
      "video.perfectgame.tv",
      "web-cdn.perfectgame.tv",
      "s3.amazonaws.com",
      "dcb80a363a4153137b52-e3e81376f7ea45aa66e55c5aeb0ba59e.ssl.cf1.rackcdn.com",
      "web-cdn.blivenyc.com",
      "d2x49pf2i7371p.cloudfront.net",
    ],
  },
  webpack(config, { dev }) {
    if (dev) {
      config.devtool = "eval-source-map"
    }
    return config
  },
}

module.exports = nextConfig
