import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useUser } from "../context/UserContext";

interface ViewOrderProps {
  onClose: () => void;
  onSave: (data: OrderFormData, isNew: string) => void;
  _state: string;
  admin: boolean;
  row?: OrderFormData;
  project_id?: number;
}

interface OrderFormData {
  ID: number;
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
  project_id?: number;
}

interface Winkel {
  ID: number;
  naam: string;
  link: string;
  project_id?: number; // 'project_id' is optioneel omdat sommige winkels mogelijk geen project gekoppeld hebben
}

const ViewOrder: React.FC<ViewOrderProps> = ({
  onClose,
  onSave,
  _state,
  admin,
  row,
  project_id,
}) => {
  const { user } = useUser();
  const [orderFormData, setOrderFormData] = useState<OrderFormData>({
    ID: row?.ID || 0,
    Leveringsadres: row?.Leveringsadres || "Xaverianenstraat hoofdgebouw",
    Datum_aanvraag:
      row?.Datum_aanvraag ||
      new Date().toISOString().split("T")[0].split("-").reverse().join("-"),
    Korte_omschrijving: row?.Korte_omschrijving || "",
    Aantal: row?.Aantal || 1,
    Winkel: row?.Winkel || "",
    Artikelnummer: row?.Artikelnummer || "",
    URL: row?.URL || "",
    Totale_kostprijs_excl_BTW: row?.Totale_kostprijs_excl_BTW || 0.0,
    Aangevraagd_door:
      row?.Aangevraagd_door || user?.name || user?.login || "Unknown",
    Aantal_dagen_levertijd: row?.Aantal_dagen_levertijd || 0,
    Status: row?.Status || "Afwachting",
    Gekeurd_door_coach: row?.Gekeurd_door_coach || " ",
    Bestelling_ingegeven_RQ_nummer: row?.Bestelling_ingegeven_RQ_nummer || " ",
    Bestelling_door_financ_dienst_geplaatst:
      !!row?.Bestelling_door_financ_dienst_geplaatst ? "Ja" : "Nee",
    Bestelling_verzonden_verwachtte_aankomst:
      row?.Bestelling_verzonden_verwachtte_aankomst || " ",
    Bestelling_ontvangen_datum: row?.Bestelling_ontvangen_datum || " ",
    Opmerkingen: row?.Opmerkingen || "",
    project_id: row?.project_id || 0,
  });
  const [state, setState] = useState(_state);

  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  const [winkels, setWinkels] = useState<
    { ID: number; naam: string; link: string; project_id?: number }[]
  >([]);

  useEffect(() => {
    const fetchWinkels = async () => {
      try {
        const response = await fetch(`${backendUrl}/winkels`);
        const data: Winkel[] = await response.json();
        console.log("Fetched winkels:", data); // Zorg ervoor dat de data wordt gelogd

        // Controleer of de gebruiker een admin is
        if (user && user.role === "admin") {
          // Admins zien alle winkels
          setWinkels(data);
        } else if (user && user.projects) {
          console.log(project_id);
          // Niet-admin gebruikers zien alleen winkels van hun projecten
          const userWinkels = data.filter(
            (winkel: Winkel) =>
              !winkel.project_id || // Winkels zonder project_id zijn voor iedereen zichtbaar
              winkel.project_id === project_id
          );
          setWinkels(userWinkels);
        }
      } catch (error) {
        console.error("Error fetching winkels:", error);
      }
    };
    fetchWinkels();
  }, [backendUrl, user, project_id]);

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
      onSave(orderFormData, state);
      onClose();
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        {state === "new" ? (
          <h3>Nieuwe bestelling plaatsen</h3>
        ) : (
          <div className="flex">
            <h2>Bestelling: {orderFormData.Korte_omschrijving}</h2>
            <button
              className="edit-order-button"
              onClick={() => setState("edit")}
            >
              <i className="fas fa-pencil-alt"></i>
            </button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="styled-form">
          {Object.keys(orderFormData).map((key) => {
            if (key === "ID" || key === "project_id") {
              return null;
            }
            const isHiddenForNonAdmin =
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
              ].includes(key);

            if ((state === "edit" || state === "new") && isHiddenForNonAdmin) {
              return null;
            }

            return (
              <div key={key} className="form-group">
                <label htmlFor={key}>{key.replace(/_/g, " ")}:</label>
                {key === "Bestelling_door_financ_dienst_geplaatst" ? (
                  <input
                    type="checkbox"
                    id={key}
                    name={key}
                    checked={orderFormData[key as keyof OrderFormData] === "Ja"}
                    onChange={(e) =>
                      setOrderFormData((prev) => ({
                        ...prev,
                        [key]: e.target.checked ? "Ja" : "Nee",
                      }))
                    }
                    className="form-input"
                    disabled={state.includes("view")}
                  />
                ) : key === "Winkel" ? (
                  <select
                    id="winkel"
                    name="Winkel"
                    value={orderFormData.Winkel}
                    onChange={handleChange}
                    className="form-input"
                    required
                    disabled={state.includes("view")}
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
                    disabled={state.includes("view")}
                  />
                )}
              </div>
            );
          })}
          <div className="popup-actions">
            {state !== "view" ? (
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
