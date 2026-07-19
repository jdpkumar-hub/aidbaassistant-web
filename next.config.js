const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
	images: {
	  remotePatterns: [
		{
		  protocol: "https",
		  hostname: "lh3.googleusercontent.com",
		},
		{
		  protocol: "https",
		  hostname: "avatars.githubusercontent.com",
		},
	  ],
	},
};

export default nextConfig;