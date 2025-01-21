const db = require("./dB");

const getAllWinkels = (req, res) => {
  const query = "SELECT * FROM winkels";

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Failed to retrieve winkels" });
    }
    res.status(200).json(results);
  });
};

const createWinkel = (req, res) => {
  const { naam, link, project_id } = req.body;

  if (!naam || !link) {
    return res.status(400).json({ error: "Naam and link are required" });
  }

  const query = "INSERT INTO winkels (naam, link, project_id) VALUES (?, ?, ?)";

  const queryValues = [naam, link, project_id || null];

  db.query(query, queryValues, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to create winkel" });
    }
    res.status(201).json({ id: result.insertId, naam, link, project_id });
  });
};

const deleteWinkel = (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM winkels WHERE id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to delete winkel" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Winkel not found" });
    }
    res.status(200).json({ message: "Winkel deleted successfully" });
  });
};

const updateWinkel = (req, res) => {
  const { id } = req.params;
  const { naam, link } = req.body;

  if (!naam && !link) {
    return res.status(400).json({ error: "At least one field is required" });
  }

  const fields = [];
  const values = [];

  if (naam) {
    fields.push("naam = ?");
    values.push(naam);
  }
  if (link) {
    fields.push("link = ?");
    values.push(link);
  }

  values.push(id);

  const query = `UPDATE winkels SET ${fields.join(", ")} WHERE id = ?`;

  db.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to update winkel" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Winkel not found" });
    }
    res.status(200).json({ message: "Winkel updated successfully" });
  });
};

module.exports = {
  getAllWinkels,
  createWinkel,
  deleteWinkel,
  updateWinkel
};
