const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.BACKEND_PORT || 3001;
const url = process.env.BACKEND_URL || "http://localhost";

const controller = require("./controller");

app.use(
  cors({
    origin: "*"
  })
);

app.use(bodyParser.json());

app.get("/projects", controller.getAllProjects);
app.get("/producten", controller.getAllProducts);
app.post("/projects", controller.createProject);
app.post("/producten", controller.createProduct);
app.put("/projects/:id", controller.updateProject);
app.put("/producten/:id", controller.updateProduct);
app.delete("/projects/:id", controller.deleteProject);
app.delete("/producten/:id", controller.deleteProduct);

app.get("/*", (req, res) => {
  res.redirect("/api-docs");
});

app.listen(port, () => {
  console.log(`Backend started on ${url}:${port}`);
});
