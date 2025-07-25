
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'avatars.githubusercontent.com'],
  },
  // Força todas as rotas a serem dinâmicas  
  experimental: {
    esmExternals: true,
  },
}

module.exports = nextConfig