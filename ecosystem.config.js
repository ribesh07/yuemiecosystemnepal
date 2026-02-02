module.exports = {
  apps: [
    {
      name: "nextjs-app",
      script: "npm",
      args: "run start",
      cwd: "/home/yuemicom/yuemicom",
      env: {
        NODE_ENV: "production",
        PORT:4445
      },
    },
  ],
};
