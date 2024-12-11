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
  const query = "SELECT * FROM products";

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Failed to retrieve products" });
    }
    res.status(200).json(results);
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

const createProduct = (req, res) => {
  const {
    Leveringsadres,
    Datum_aanvraag,
    Aantal,
    Korte_omschrijving,
    Winkel,
    Artikelnummer,
    URL = null,
    Totale_kostprijs_excl_BTW,
    Aangevraagd_door,
    Aantal_dagen_levertijd,
    Goedgekeurd_door_coach = false,
    Bestelling_ingegeven_RQ_nummer = null,
    Bestelling_door_financ_dienst_geplaatst = false,
    Bestelling_verzonden_verwachtte_aankomst = null,
    Bestelling_ontvangen_datum = null,
    Opmerkingen = null,
    project_id,
  } = req.body;

  // Controleer verplichte velden
  if (
    !project_id ||
    !Leveringsadres ||
    !Korte_omschrijving ||
    !Aantal ||
    !Totale_kostprijs_excl_BTW
  ) {
    return res.status(400).json({ error: "Required fields are missing" });
  }

  const query = `
        INSERT INTO products (
            Leveringsadres, Datum_aanvraag, Aantal, Korte_omschrijving, Winkel, Artikelnummer, URL,
            Totale_kostprijs_excl_BTW, Aangevraagd_door, Aantal_dagen_levertijd, Goedgekeurd_door_coach,
            Bestelling_ingegeven_RQ_nummer, Bestelling_door_financ_dienst_geplaatst,
            Bestelling_verzonden_verwachtte_aankomst, Bestelling_ontvangen_datum, Opmerkingen, project_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    query,
    [
      Leveringsadres,
      Datum_aanvraag,
      parseInt(Aantal, 10) || 0, // Zorg dat Aantal een integer is
      Korte_omschrijving,
      Winkel,
      Artikelnummer,
      URL,
      parseFloat(Totale_kostprijs_excl_BTW) || 0.0, // Zorg dat dit een float is
      Aangevraagd_door,
      parseInt(Aantal_dagen_levertijd, 10) || 0, // Zorg dat dit een integer is
      Goedgekeurd_door_coach,
      Bestelling_ingegeven_RQ_nummer,
      Bestelling_door_financ_dienst_geplaatst,
      Bestelling_verzonden_verwachtte_aankomst,
      Bestelling_ontvangen_datum,
      Opmerkingen,
      parseInt(project_id, 10), // Zorg dat dit een integer is
    ],
    (err, result) => {
      if (err) {
        console.error("SQL Error:", err); // Log de specifieke fout
        return res
          .status(500)
          .json({ error: "Failed to create product", details: err.message });
      }
      res.status(201).json({ id: result.insertId, project_id });
    }
  );
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

const deleteProduct = (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM products WHERE ID = ?";

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
    project_id,
  } = req.body;

  const query = `
        UPDATE products
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
      role: results[0].role,
    });
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
  getProductsByProjectId,
};
