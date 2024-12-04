const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.BACKEND_PORT || 3000;
const url = process.env.BACKEND_URL || "http://localhost";

const db = require("./dB");

const swaggerUi = require("swagger-ui-express");
const swaggerJSdoc = require("swagger-jsdoc");

app.use(
  cors({
    origin: "*",
  })
);

app.use(bodyParser.json());
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
    }
  )
);

// app.get
// app.post

app.get("/*", (req, res) => {
  res.redirect("/api-docs");
});
app.listen(port, () => {
  console.log(`Backend started on ${url}:${port}`);
});
