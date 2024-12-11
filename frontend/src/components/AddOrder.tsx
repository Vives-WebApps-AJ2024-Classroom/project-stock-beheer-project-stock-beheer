import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";

interface AddOrderProps {
  onClose: () => void;
  onSave: (data: OrderFormData) => void;
}

interface OrderFormData {
  Korte_omschrijving: string;
  Artikelnummer: string;
  Aantal: string;
  Winkel: string;
  URL: string;
  Totale_kostprijs_excl_BTW: string;
  Aantal_dagen_levertijd: string;
  Opmerkingen: string;
}

const AddOrder: React.FC<AddOrderProps> = ({ onClose, onSave }) => {
  const [orderFormData, setOrderFormData] = useState<OrderFormData>({
    Korte_omschrijving: "",
    Artikelnummer: "",
    Aantal: "0",
    Winkel: "",
    URL: "",
    Totale_kostprijs_excl_BTW: "0.00",
    Aantal_dagen_levertijd: "0",
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
    if (!orderFormData.Aantal || isNaN(Number(orderFormData.Aantal))) {
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
        <h3>Voeg Nieuwe Order Toe</h3>
        <form onSubmit={handleSubmit} className="styled-form">
          {Object.keys(orderFormData).map((key) => (
            <div key={key} className="form-group">
              <label htmlFor={key}>{key.replace(/_/g, " ")}:</label>
              {key === "Winkel" ? (
                // Dropdown voor Winkel
                <select
                  id={key}
                  name={key}
                  value={orderFormData[key as keyof OrderFormData]}
                  onChange={handleChange}
                  className="form-input"
                  required
                >
                  <option value="">Selecteer een winkel</option>
                  {winkels.map((winkel) => (
                    <option key={winkel.ID} value={winkel.naam}>
                      {winkel.naam}
                    </option>
                  ))}
                </select>
              ) : (
                // Andere invoervelden
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
                />
              )}
            </div>
          ))}
          <div className="popup-actions">
            <button type="submit">Opslaan</button>
            <button type="button" onClick={onClose}>
              Annuleren
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export { AddOrder };
export type { OrderFormData };
