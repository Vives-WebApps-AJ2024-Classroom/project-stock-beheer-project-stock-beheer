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

const getAllProducts = (req, res) => {
  const query = "SELECT * FROM producten";

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Failed to retrieve products" });
    }
    res.status(200).json(results);
  });
};

const createProject = (req, res) => {
  const { project_naam } = req.body;

  if (!project_naam) {
    return res.status(400).json({ error: "Project name is required" });
  }

  const query = "INSERT INTO project (project_naam) VALUES (?)";

  db.query(query, [project_naam], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to create project" });
    }
    res.status(201).json({ id: result.insertId, project_naam });
  });
};

const createProduct = (req, res) => {
  const {
    Leveringsadres,
    Datum_aanvraag,
    Aantal,
    Korte_omschrijving,
    Winkel,
    Artikelnummer,
    URL,
    Totale_kostprijs_excl_BTW,
    Aangevraagd_door,
    Aantal_dagen_levertijd,
    Goedgekeurd_door_coach,
    Bestelling_ingegeven_RQ_nummer,
    Bestelling_door_financ_dienst_geplaatst,
    Bestelling_verzonden_verwachtte_aankomst,
    Bestelling_ontvangen_datum,
    Opmerkingen,
    Totaalprijs_project,
    project_id,
  } = req.body;

  if (!project_id) {
    return res.status(400).json({ error: "Project ID is required" });
  }

  const query = `
        INSERT INTO producten (
            Leveringsadres, Datum_aanvraag, Aantal, Korte_omschrijving, Winkel, Artikelnummer, URL,
            Totale_kostprijs_excl_BTW, Aangevraagd_door, Aantal_dagen_levertijd, Goedgekeurd_door_coach,
            Bestelling_ingegeven_RQ_nummer, Bestelling_door_financ_dienst_geplaatst,
            Bestelling_verzonden_verwachtte_aankomst, Bestelling_ontvangen_datum, Opmerkingen,
            Totaalprijs_project, project_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    query,
    [
      Leveringsadres,
      Datum_aanvraag,
      Aantal,
      Korte_omschrijving,
      Winkel,
      Artikelnummer,
      URL,
      Totale_kostprijs_excl_BTW,
      Aangevraagd_door,
      Aantal_dagen_levertijd,
      Goedgekeurd_door_coach,
      Bestelling_ingegeven_RQ_nummer,
      Bestelling_door_financ_dienst_geplaatst,
      Bestelling_verzonden_verwachtte_aankomst,
      Bestelling_ontvangen_datum,
      Opmerkingen,
      Totaalprijs_project,
      project_id,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Failed to create product" });
      }
      res.status(201).json({ id: result.insertId, project_id });
    }
  );
};

const deleteProject = (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM project WHERE id = ?";

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

const deleteProduct = (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM producten WHERE ID = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to delete product" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
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

const updateProduct = (req, res) => {
  const { id } = req.params;
  const {
    Leveringsadres,
    Datum_aanvraag,
    Aantal,
    Korte_omschrijving,
    Winkel,
    Artikelnummer,
    URL,
    Totale_kostprijs_excl_BTW,
    Aangevraagd_door,
    Aantal_dagen_levertijd,
    Goedgekeurd_door_coach,
    Bestelling_ingegeven_RQ_nummer,
    Bestelling_door_financ_dienst_geplaatst,
    Bestelling_verzonden_verwachtte_aankomst,
    Bestelling_ontvangen_datum,
    Opmerkingen,
    Totaalprijs_project,
    project_id,
  } = req.body;

  const query = `
        UPDATE producten
        SET Leveringsadres = ?, Datum_aanvraag = ?, Aantal = ?, Korte_omschrijving = ?, Winkel = ?, Artikelnummer = ?, URL = ?, 
                Totale_kostprijs_excl_BTW = ?, Aangevraagd_door = ?, Aantal_dagen_levertijd = ?, Goedgekeurd_door_coach = ?,
                Bestelling_ingegeven_RQ_nummer = ?, Bestelling_door_financ_dienst_geplaatst = ?, 
                Bestelling_verzonden_verwachtte_aankomst = ?, Bestelling_ontvangen_datum = ?, Opmerkingen = ?, 
                Totaalprijs_project = ?, project_id = ?
        WHERE ID = ?`;

  db.query(
    query,
    [
      Leveringsadres,
      Datum_aanvraag,
      Aantal,
      Korte_omschrijving,
      Winkel,
      Artikelnummer,
      URL,
      Totale_kostprijs_excl_BTW,
      Aangevraagd_door,
      Aantal_dagen_levertijd,
      Goedgekeurd_door_coach,
      Bestelling_ingegeven_RQ_nummer,
      Bestelling_door_financ_dienst_geplaatst,
      Bestelling_verzonden_verwachtte_aankomst,
      Bestelling_ontvangen_datum,
      Opmerkingen,
      Totaalprijs_project,
      project_id,
      id,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Failed to update product" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(200).json({ message: "Product updated successfully" });
    }
  );
};

const createUser = (req, res) => {
  const { username, displayname, role } = req.body;
  if (!username || !displayname || !role) {
    return res
      .status(400)
      .json({ error: "Username, displayname and role required" });
  }
  const query =
    "INSERT INTO users (username, displayname, role) VALUES (?, ?, ?)";

  db.query(query, [username, displayname, role], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Failed to create user" });
    }
    res.status(201).json({ id: result.insertId, username });
  });
};

const getAllUsers = (req, res) => {
  const query = "SELECT * FROM users";

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Failed to retrieve users" });
    }
    res.status(200).json(results);
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
  const { username, displayname, role } = req.body;

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
    res.status(200).json(results[0]);
  });
};

module.exports = {
  getAllProjects,
  getAllProducts,
  getAllUsers,
  getUserById,
  createProject,
  createProduct,
  createUser,
  deleteProject,
  deleteProduct,
  deleteUser,
  updateProject,
  updateProduct,
  updateUser,
};
