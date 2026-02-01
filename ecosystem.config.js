module.exports = {
  apps: [
    {
      name: "nextjs-app",
      script: "npm",
      args: "run start",
      cwd: "/home/yuemicom/next-app",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
