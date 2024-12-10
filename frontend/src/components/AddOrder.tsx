import React, { useState, ChangeEvent, FormEvent } from "react";

interface AddOrderProps {
  onClose: () => void;
  onSave: (data: OrderFormData) => void; // onSave accepteert formData
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
    Aantal: "",
    Winkel: "",
    URL: "",
    Totale_kostprijs_excl_BTW: "",
    Aantal_dagen_levertijd: "",
    Opmerkingen: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrderFormData({
      ...orderFormData,
      [name]: value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(orderFormData); // Geef formData door aan onSave
    onClose(); // Sluit de popup
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h3>Voeg Nieuwe Order Toe</h3>
        <form onSubmit={handleSubmit} className="styled-form">
          {Object.keys(orderFormData).map((key) => (
            <div key={key} className="form-group">
              <label htmlFor={key}>{key.replace(/_/g, " ")}:</label>
              <input
                type="text"
                id={key}
                name={key}
                value={(orderFormData as any)[key]}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          ))}
          <div className="popup-actions">
            <button type="submit">Submit</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export { AddOrder };
export type { OrderFormData };
