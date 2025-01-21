const db = require("./dB");
const nodemailer = require("nodemailer");
require("dotenv").config();

const createUser = (req, res) => {
  const { username, displayname, role, email } = req.body;
  if (!username || !displayname || !role) {
    return res
      .status(400)
      .json({ error: "Username, displayname, role required" });
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
        projects: results[0].project_ids,
        email: results[0].email,
      });
    } else {
      const query =
        "INSERT INTO users (username, displayname, role, email) VALUES (?, ?, ?, ?)";

      db.query(query, [username, displayname, role, email], (err, result) => {
        if (err) {
          return res.status(500).json({ error: "Failed to create user" });
        }
        res.status(201).json({
          id: result.insertId,
          role: role,
          username: username,
          email: email,
          displayname: displayname,
        });
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
  const { username, displayname, role, projects, email } = req.body;

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
  if (email) {
    fields.push("email = ?");
    values.push(email);
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
      role: results[0].role,
      projects: results[0].project_ids,
      email: results[0].email,
    });
  });
};

const sendEmail = (req, res) => {
  const { emails, subject, message } = req.body;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  emails.forEach((email) => {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: subject,
      text: message,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email to", email, error);
      } else {
        console.log("Email sent to", email);
      }
    });
  });

  res.status(200).json({ message: "Emails sent successfully" });
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  deleteUser,
  updateUser,
  sendEmail,
};
