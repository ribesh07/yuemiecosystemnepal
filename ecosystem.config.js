module.exports = {
  apps: [
    {
      name: "yuemi",
      script: "npm",
      args: "run start",
      cwd: "/home/sanjaya/development/yuemiecosystemnepal",
      env: {
        NODE_ENV: "production",
        PORT:4445
      },
    },
  ],
};
