import React from "react";

const BestellingHandleiding: React.FC = () => {
  return (
    <div className="handleiding-container">
      <h2>Handleiding bij Bestellingen</h2>
      <p>
        Voor elk project is er een aparte tab onderaan deze pagina, enkel de
        leden van die groep mogen aanpassingen doen aan hun tabblad.
      </p>
      <p>
        Bestellingen mogen enkel nog geplaatst worden bij de winkels die in dit
        Excel-document staan. Indien een winkel niet beschikbaar is in deze
        lijst, dien je dit eerst aan te vragen aan jouw coach. Pas nadat jouw
        coach de goedkeuring heeft gegeven om bij een winkel die niet in de
        lijst zit jouw bestellingen te plaatsen, mag je die winkel ook
        toevoegen. Bestellingen bij Amazon en Bol zijn in geen enkel geval nog
        toegestaan.
      </p>
      <p>
        Je brengt ten alle tijde jouw coach via e-mail op de hoogte van
        wijzigingen binnen dit bestand. Wanneer je dus een nieuwe bestelling
        plaatst, stuur je een mail naar jouw coach waarin je dit vermeldt. Op
        deze manier kan de coach dit bekijken en al dan niet goedkeuren.
      </p>
      <p>
        Het artikelnummer dient ook ten alle tijde ingevuld te worden. Dit is
        een unieke identificatie voor het product die je wil bestellen bij de
        website waarop je bestelt. Ingegeven in de zoekbalk van DigiKey kan je
        enkel dit product terugvinden. Dit is dan het artikelnummer die je in
        Excel dient in te geven.
      </p>
      <p>
        Bijvoorbeeld bij DigiKey willen we een ESP32-CO-DEVKITC-02 bestellen{" "}
        <a href="https://www.digikey.be/en/products/detail/esare-ssf-systems/ESP32-C3-DEVKITC-02/14553009">
          (link)
        </a>
        . Op de website van Digi-Key kan je het Digi-Key Part Number
        terugvinden. Wanneer je dit nummer kopieert en plakt, moet je ervoor
        zorgen dat dit nummer correct wordt ingevoerd in je Excel-bestand.
      </p>
    </div>
  );
};

export default BestellingHandleiding;
