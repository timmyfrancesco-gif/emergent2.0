import type { NextConfig } from 'next';

const isStaticExport = process.env.STATIC_EXPORT === 'true';
// GITHUB_REPOSITORY is "owner/repo" — extract just "repo"
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
const basePath = isStaticExport && repoName ? `/${repoName}` : '';

const nextConfig: NextConfig = {
  ...(isStaticExport
    ? {
        output: 'export',
        trailingSlash: true,
        basePath,
        assetPrefix: basePath ? `${basePath}/` : '',
      }
    : {}),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
