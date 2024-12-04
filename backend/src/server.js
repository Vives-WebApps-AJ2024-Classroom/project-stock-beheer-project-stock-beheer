const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
<<<<<<< HEAD
const port = process.env.BACKEND_PORT || 5000;
=======
const port = process.env.BACKEND_PORT || 3001;
>>>>>>> 99a7f17820657762d7f96d1df7a21dd8e7ec10cf
const url = process.env.BACKEND_URL || "http://localhost";

const controller = require("./controller");

app.use(
  cors({
    origin: "*"
  })
);

app.use(bodyParser.json());
<<<<<<< HEAD
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(
    swaggerJSdoc({
      definition: {
        openapi: "3.1.0",
        info: {
          title: "Stock beheer API",
          version: process.env.npm_package_version || "0.0.0",
        },
        servers: [
          {
            url: process.env.BACKEND_URL + ":" + process.env.BACKEND_PORT,
          },
        ],
      },
      apis: ["./**/swagger.yaml"],
    }),
    {
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "Stock beheerInteractive Corridor API Documentation",
      customfavIcon: "http://localhost:3000/favicon.ico",
    }
  )
);
// app.get
// app.post
=======

app.get("/projects", controller.getAllProjects);
app.get("/producten", controller.getAllProducts);
app.post("/projects", controller.createProject);
app.post("/producten", controller.createProduct);
app.put("/projects/:id", controller.updateProject);
app.put("/producten/:id", controller.updateProduct);
app.delete("/projects/:id", controller.deleteProject);
app.delete("/producten/:id", controller.deleteProduct);
>>>>>>> 99a7f17820657762d7f96d1df7a21dd8e7ec10cf

app.get("/*", (req, res) => {
  res.redirect("/api-docs");
});

app.listen(port, () => {
  console.log(`Backend started on ${url}:${port}`);
});
