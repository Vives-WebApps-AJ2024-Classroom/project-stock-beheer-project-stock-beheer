const db = require("./dB");

const createUser = (req, res) => {
  const { username, displayname, role } = req.body;
  if (!username || !displayname || !role) {
    return res
      .status(400)
      .json({ error: "Username, displayname and role required" });
  }

  const checkUserQuery = "SELECT * FROM users WHERE username = ?";
  db.query(checkUserQuery, [username], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Failed to check user existence" });
    }
    if (results.length > 0) {
      return res.status(201).json({
        id: results[0].ID,
        role: results[0].role,
        username: results[0].username,
        displayname: results[0].displayname,
        projects: results[0].project_ids
      });
    } else {
      const query =
        "INSERT INTO users (username, displayname, role) VALUES (?, ?, ?)";

      db.query(query, [username, displayname, role], (err, result) => {
        if (err) {
          return res.status(500).json({ error: "Failed to create user" });
        }
        res
          .status(201)
          .json({ id: result.insertId, role: role, username: username });
      });
    }
  });
};

const getAllUsers = (req, res) => {
  const query = "SELECT * FROM users";

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Failed to retrieve users" });
    }
    return res.status(200).json(results);
  });
};

const deleteUser = (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM users WHERE id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to delete user" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  });
};

const updateUser = (req, res) => {
  const { id } = req.params;
  const { username, displayname, role, projects } = req.body;

  let fields = [];
  let values = [];

  if (username) {
    fields.push("username = ?");
    values.push(username);
  }
  if (displayname) {
    fields.push("displayname = ?");
    values.push(displayname);
  }
  if (role) {
    fields.push("role = ?");
    values.push(role);
  }
  if (projects) {
    fields.push("project_ids = ?");
    values.push(projects);
  }

  if (fields.length === 0) {
    return res.status(400).json({ error: "No fields to update" });
  }

  values.push(id);
  const query = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;

  db.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to update user" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User updated successfully" });
  });
};

const getUserById = (req, res) => {
  const { id } = req.params;

  const query = "SELECT * FROM users WHERE id = ?";

  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Failed to retrieve user" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({
      id: results[0].id,
      username: results[0].username,
      displayname: results[0].displayname,
      role: results[0].role
    });
  });
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  deleteUser,
  updateUser
};
