const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.BACKEND_PORT || 5000;
const url = process.env.BACKEND_URL || "http://localhost";

const controller = require("./controller");

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

app.get("/*", (req, res) => {
  res.redirect("/api-docs");
});

app.listen(port, () => {
  console.log(`Backend started on ${url}:${port}`);
});
