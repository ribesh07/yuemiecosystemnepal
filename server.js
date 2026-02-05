const next = require("next");
const express = require("express");

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 4445;
const hostname = "localhost";

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // ✅ Serve uploaded files
 server.use(
  "/uploads",
  express.static("/var/www/yuemi/uploads", {
    maxAge: "7d",
    immutable: false,
  })
);

  // (optional) custom routes
  server.get("/", (req, res) => {
    return app.render(req, res, "/home");
  });

  server.get("/a", (req, res) => {
    return app.render(req, res, "/a");
  });

  server.get("/b", (req, res) => {
    return app.render(req, res, "/b");
  });

  // ✅ Everything else → Next.js
  server.use((req, res) => {
    return handle(req, res);
  });
  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
