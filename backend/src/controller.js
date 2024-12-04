const db = require("./dB");

const getAllProjects = (req, res) => {
  const query = "SELECT * FROM project";

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
    project_id
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
      project_id
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

  const query = "UPDATE project SET project_naam = ? WHERE id = ?";

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
    project_id
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
      id
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

module.exports = {
  getAllProjects,
  getAllProducts,
  createProject,
  createProduct,
  deleteProject,
  deleteProduct,
  updateProject,
  updateProduct
};
