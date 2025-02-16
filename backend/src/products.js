const db = require("./dB");

const getAllProducts = (req, res) => {
  const query = `
    SELECT 
      products.*, 
      projects.project_naam
    FROM 
      products
    INNER JOIN 
      projects ON products.project_id = projects.id
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Failed to retrieve products" });
    }
    res.status(200).json(results); // Voeg de project_naam toe aan de response
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
    Status = "Afwachting",
    Gekeurd_door_coach = null,
    Bestelling_ingegeven_RQ_nummer = null,
    Bestelling_door_financ_dienst_geplaatst = null,
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
            Totale_kostprijs_excl_BTW, Aangevraagd_door, Aantal_dagen_levertijd, Status, Gekeurd_door_coach,
            Bestelling_ingegeven_RQ_nummer, Bestelling_door_financ_dienst_geplaatst,
            Bestelling_verzonden_verwachtte_aankomst, Bestelling_ontvangen_datum, Opmerkingen, project_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

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
      Status,
      Gekeurd_door_coach,
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

const updateProduct = (req, res) => {
  const ID = parseInt(req.params.id, 10);
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
    Status,
    Gekeurd_door_coach,
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
                Totale_kostprijs_excl_BTW = ?, Aangevraagd_door = ?, Aantal_dagen_levertijd = ?, Status = ?, Gekeurd_door_coach = ?,
                Bestelling_ingegeven_RQ_nummer = ?, Bestelling_door_financ_dienst_geplaatst = ?, 
                Bestelling_verzonden_verwachtte_aankomst = ?, Bestelling_ontvangen_datum = ?, Opmerkingen = ?, project_id = ?
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
      Status,
      Gekeurd_door_coach,
      Bestelling_ingegeven_RQ_nummer,
      Bestelling_door_financ_dienst_geplaatst,
      Bestelling_verzonden_verwachtte_aankomst,
      Bestelling_ontvangen_datum,
      Opmerkingen,
      project_id,
      ID,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Failed to update product", err });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(200).json({ message: "Product updated successfully" });
    }
  );
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

module.exports = {
  getAllProducts,
  createProduct,
  deleteProduct,
  updateProduct,
};
