const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.BACKEND_PORT || 5000;
const url = process.env.BACKEND_URL || "http://localhost";
const axios = require("axios");

const controller = require("./controller");
const clientId = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;

app.use(
  cors({
    origin: "*",
  })
);

app.use(bodyParser.json());

app.get("/projects", controller.getAllProjects);
app.get("/producten", controller.getAllProducts);
app.get("/users", controller.getAllUsers);
app.post("/projects", controller.createProject);
app.post("/producten", controller.createProduct);
app.post("/users", controller.createUser);
app.put("/projects/:id", controller.updateProject);
app.put("/producten/:id", controller.updateProduct);
app.put("/users/:id", controller.updateUser);
app.delete("/projects/:id", controller.deleteProject);
app.delete("/producten/:id", controller.deleteProduct);
app.delete("/users/:id", controller.deleteUser);
app.get("/auth/github", async (req, res) => {
  const code = req.query.code;
  const tokenResponse = await axios.post(
    "https://github.com/login/oauth/access_token",
    {
      client_id: clientId,
      client_secret: clientSecret,
      code,
    },
    {
      headers: { Accept: "application/json" },
    }
  );

  const accessToken = tokenResponse.data.access_token;
  res.json({ accessToken });
});

app.get("/*", (req, res) => {
  res.redirect("/api-docs");
});

app.listen(port, () => {
  console.log(`Backend started on ${url}:${port}`);
});
