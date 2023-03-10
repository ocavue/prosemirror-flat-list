import nextra from 'nextra'

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.jsx',
})

/**
 * @type {import('next').NextConfig}
 */
const config = {
  images: {
    unoptimized: true,
  },
}

export default withNextra(config)
