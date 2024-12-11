const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.BACKEND_PORT || 5000;
const url = process.env.BACKEND_URL || "http://localhost";
const axios = require("axios");

const controller = require("./controller");
const winkelsController = require("./winkels");
const clientId = process.env.GITHUB_CLIENT_ID || "Ov23li5gezrPiarupgQe";
const clientSecret =
  process.env.GITHUB_CLIENT_SECRET ||
  "dfeeaa7e407eea89214c20b5eded066f33d6c779";

app.use(
  cors({
    origin: "*"
  })
);

app.use(bodyParser.json());

// Project-related routes
app.get("/projects", controller.getAllProjects);
app.get("/projects/:id/products", controller.getProductsByProjectId);
app.post("/projects", controller.createProject);
app.put("/projects/:id", controller.updateProject);
app.delete("/projects/:id", controller.deleteProject);

// Product-related routes
app.get("/products", controller.getAllProducts);
app.post("/products", controller.createProduct);
app.put("/products/:id", controller.updateProduct);
app.delete("/products/:id", controller.deleteProduct);

// User-related routes
app.get("/users", controller.getAllUsers);
app.get("/users/:id", controller.getUserById);
app.post("/users", controller.createUser);
app.put("/users/:id", controller.updateUser);
app.delete("/users/:id", controller.deleteUser);

// Winkels-related routes
app.get("/winkels", winkelsController.getAllWinkels);
app.post("/winkels", winkelsController.createWinkel);
app.put("/winkels/:id", winkelsController.updateWinkel);
app.delete("/winkels/:id", winkelsController.deleteWinkel);

// GitHub authentication route
app.get("/auth/github", async (req, res) => {
  const code = req.query.code;
  const tokenResponse = await axios.post(
    "https://github.com/login/oauth/access_token",
    {
      client_id: clientId,
      client_secret: clientSecret,
      code
    },
    {
      headers: { Accept: "application/json" }
    }
  );

  const accessToken = tokenResponse.data.access_token;
  res.json({ accessToken });
});

// Default route
app.get("/*", (req, res) => {
  res.redirect("/api-docs");
});

// Start the server
app.listen(port, () => {
  console.log(`Backend started on ${url}:${port}`);
});
