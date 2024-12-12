import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";

interface ViewOrderProps {
  onClose: () => void;
  onSave: (data: OrderFormData) => void;
  editing: boolean;
  admin: boolean;
}

interface OrderFormData {
  Leveringsadres: string;
  Datum_aanvraag: string;
  Korte_omschrijving: string;
  Aantal: number;
  Winkel: string;
  Artikelnummer: string;
  URL: string;
  Totale_kostprijs_excl_BTW: number;
  Aangevraagd_door: string;
  Aantal_dagen_levertijd: number;
  Status: string;
  Gekeurd_door_coach: string;
  Bestelling_ingegeven_RQ_nummer: string;
  Bestelling_door_financ_dienst_geplaatst: string;
  Bestelling_verzonden_verwachtte_aankomst: string;
  Bestelling_ontvangen_datum: string;
  Opmerkingen: string;
}

const ViewOrder: React.FC<ViewOrderProps> = ({
  onClose,
  onSave,
  editing,
  admin,
}) => {
  const [orderFormData, setOrderFormData] = useState<OrderFormData>({
    Leveringsadres: "Xaverianenstraat hoofdgebouw",
    Datum_aanvraag: "",
    Korte_omschrijving: "",
    Aantal: 1,
    Winkel: "",
    Artikelnummer: "",
    URL: "",
    Totale_kostprijs_excl_BTW: 0.0,
    Aangevraagd_door: "",
    Aantal_dagen_levertijd: 0,
    Status: "",
    Gekeurd_door_coach: "",
    Bestelling_ingegeven_RQ_nummer: "",
    Bestelling_door_financ_dienst_geplaatst: "",
    Bestelling_verzonden_verwachtte_aankomst: "",
    Bestelling_ontvangen_datum: "",
    Opmerkingen: "",
  });
  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  const [winkels, setWinkels] = useState<
    { ID: number; naam: string; link: string }[]
  >([]);

  // Haal de lijst van winkels op bij het laden van de component
  useEffect(() => {
    const fetchWinkels = async () => {
      try {
        const response = await fetch(`${backendUrl}/winkels`);
        const data = await response.json();
        console.log("Fetched winkels:", data);
        setWinkels(data); // Stel de winkel lijst in
      } catch (error) {
        console.error("Error fetching winkels:", error);
      }
    };

    fetchWinkels();
  }, [backendUrl]);

  const validateForm = (): boolean => {
    if (!orderFormData.Korte_omschrijving.trim()) {
      alert("Korte omschrijving is verplicht.");
      return false;
    }
    if (
      !orderFormData.Aantal ||
      isNaN(Number(orderFormData.Aantal)) ||
      orderFormData.Aantal <= 0
    ) {
      alert("Aantal moet een geldig getal zijn.");
      return false;
    }
    if (
      !orderFormData.Totale_kostprijs_excl_BTW ||
      isNaN(Number(orderFormData.Totale_kostprijs_excl_BTW))
    ) {
      alert("Totale kostprijs excl. BTW moet een geldig getal zijn.");
      return false;
    }
    if (!orderFormData.Winkel.trim()) {
      alert("Winkel is verplicht.");
      return false;
    }
    if (
      !orderFormData.Aantal_dagen_levertijd ||
      isNaN(Number(orderFormData.Aantal_dagen_levertijd)) ||
      orderFormData.Aantal_dagen_levertijd <= 0
    ) {
      alert("Aantal dagen levertijd moet een geldig getal zijn.");
      return false;
    }
    return true;
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setOrderFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(orderFormData);
      onClose();
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h3>Nieuwe bestelling plaatsen</h3>
        <form onSubmit={handleSubmit} className="styled-form">
          {Object.keys(orderFormData).map((key) => {
            if (
              !admin &&
              [
                "Leveringsadres",
                "Datum_aanvraag",
                "Aangevraagd_door",
                "Status",
                "Gekeurd_door_coach",
                "Bestelling_ingegeven_RQ_nummer",
                "Bestelling_door_financ_dienst_geplaatst",
                "Bestelling_verzonden_verwachtte_aankomst",
                "Bestelling_ontvangen_datum",
              ].includes(key)
            ) {
              return null; // Verberg deze velden als admin false is
            }
            return (
              <div key={key} className="form-group">
                <label htmlFor={key}>{key.replace(/_/g, " ")}:</label>
                {key === "Winkel" ? (
                  <select
                    id={key}
                    name={key}
                    value={orderFormData[key as keyof OrderFormData]}
                    onChange={handleChange}
                    className="form-input"
                    required
                    disabled={!editing}
                  >
                    <option value="" disabled hidden>
                      Selecteer winkel
                    </option>
                    {winkels.map((winkel) => (
                      <option key={winkel.ID} value={winkel.naam}>
                        {winkel.naam}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={
                      key === "URL"
                        ? "url"
                        : key.includes("Aantal") ||
                          key.includes("Totale_kostprijs")
                        ? "number"
                        : "text"
                    }
                    id={key}
                    name={key}
                    value={(orderFormData as any)[key]}
                    onChange={handleChange}
                    className="form-input"
                    required={key !== "URL" && key !== "Opmerkingen"}
                    disabled={!editing}
                  />
                )}
              </div>
            );
          })}
          <div className="popup-actions">
            {editing === true ? (
              <>
                <button type="submit">Opslaan</button>
                <button type="button" onClick={onClose}>
                  Annuleren
                </button>
              </>
            ) : (
              <button type="button" onClick={onClose}>
                Sluiten
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export { ViewOrder };
export type { OrderFormData };
