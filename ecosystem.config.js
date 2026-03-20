module.exports = {
  apps: [
    {
      name: "yuemi",
      script: "npm",
      args: "run start",
      cwd: "/home/sanjaya/development/yuemiecosystemnepal",
      env: {
        NODE_ENV: "production",
        PORT:4445,
        PDFKIT_FONTDIR:
          "/home/sanjaya/development/yuemiecosystemnepal/node_modules/pdfkit/js/data",
      },
    },
  ],
};
