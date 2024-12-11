const db = require("./dB");

const getAllProjects = (req, res) => {
  const query = "SELECT * FROM projects";

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Failed to retrieve projects" });
    }
    res.status(200).json(results);
  });
};

const createProject = (req, res) => {
  const { project_naam } = req.body;

  if (!project_naam) {
    return res.status(400).json({ error: "Project name is required" });
  }

  const query = "INSERT INTO projects (project_naam) VALUES (?)";

  db.query(query, [project_naam], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to create project" });
    }
    res.status(201).json({ id: result.insertId, project_naam });
  });
};

const deleteProject = (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM projects WHERE id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to delete project" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.status(200).json({ message: "Project deleted successfully" });
  });
};

const getProductsByProjectId = (req, res) => {
  const { id } = req.params;

  const query = "SELECT * FROM products WHERE project_id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Failed to retrieve products" });
    }
    res.status(200).json(results);
  });
};

const updateProject = (req, res) => {
  const { id } = req.params;
  const { project_naam } = req.body;

  if (!project_naam) {
    return res.status(400).json({ error: "Project name is required" });
  }

  const query = "UPDATE projects SET project_naam = ? WHERE id = ?";

  db.query(query, [project_naam, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to update project" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.status(200).json({ message: "Project updated successfully" });
  });
};

module.exports = {
  getAllProjects,
  getProductsByProjectId,
  createProject,
  deleteProject,
  updateProject,
};
