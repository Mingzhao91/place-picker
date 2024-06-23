import express from "express";

import { AVAILABLE_LOCATIONS } from "./data/available-locations.js";
import renderLocationsPage from "./views/index.js";
import renderLocation from "./views/components/location.js";

function getSuggestedLocations() {
  const availableLocations = AVAILABLE_LOCATIONS.filter(
    (location) => !INTERESTING_LOCATIONS.includes(location)
  );

  if (availableLocations.length < 2) return availableLocations;

  const suggestedLocation1 = availableLocations.splice(
    Math.floor(Math.random() * availableLocations.length),
    1
  )[0];
  const suggestedLocation2 = availableLocations.splice(
    Math.floor(Math.random() * availableLocations.length),
    1
  )[0];

  return [suggestedLocation1, suggestedLocation2];
}

const app = express();

const INTERESTING_LOCATIONS = [];

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  const availableLocations = AVAILABLE_LOCATIONS.filter(
    (location) => !INTERESTING_LOCATIONS.includes(location)
  );
  const suggestdLocations = getSuggestedLocations();
  res.send(
    renderLocationsPage(
      suggestdLocations,
      availableLocations,
      INTERESTING_LOCATIONS
    )
  );
});

app.get("/suggested-locations", (req, res) => {
  const suggestdLocations = getSuggestedLocations();

  res.send(
    suggestdLocations.map((location) => renderLocation(location)).join("")
  );
});

app.post("/places", (req, res) => {
  const locationId = req.body.locationId;
  const location = AVAILABLE_LOCATIONS.find((loc) => loc.id === locationId);
  INTERESTING_LOCATIONS.push(location);

  const availableLocations = AVAILABLE_LOCATIONS.filter(
    (location) => !INTERESTING_LOCATIONS.includes(location)
  );

  const suggestdLocations = getSuggestedLocations();

  // apply out of band swap to update the available locations and suggested locations
  res.send(`
    ${renderLocation(location, false)}

    <ul id="suggested-location" class="locations" hx-swap-oob="innerHTML">
      ${suggestdLocations.map((location) => renderLocation(location)).join("")}
    </ul>

    <ul id="available-locations" class="locations" hx-swap-oob="true">
      ${availableLocations.map((location) => renderLocation(location)).join("")}
    </ul>
  `);
});

app.get("/places/:id", (req, res) => {
  const placeId = req.params.id;
  const location = AVAILABLE_LOCATIONS.find(
    (location) => location.id === placeId
  );

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Interesting Locations</title>
        <link rel="stylesheet" href="/main.css" />
        <link rel="icon" href="/logo.png" />
        <script src="/htmx.js" defer></script>
        <script src="/main.js" defer></script>
      </head>
      <body hx-boost="true">
        <header>
          <img src="/logo.png" alt="Stylized globe" />
          <h1>PlacePicker</h1>
          <p>
            Create your personal collection of places you would like to visit or
            you have visited.
          </p>
        </header>
        <main id="place-detail">
          <header>
            <img src="/images/${location.image.src}" alt="${location.image.alt}">
            <div>
              <h1>${location.title}</h1>
            </div>
          </header>
          <p id="place-detail-description">${location.description}</p>
        </main>
      </body>
    </html>
    
  `);
});

app.delete("/places/:id", (req, res) => {
  const locationId = req.params.id;
  const locationIndex = INTERESTING_LOCATIONS.findIndex(
    (loc) => loc.id === locationId
  );
  INTERESTING_LOCATIONS.splice(locationIndex, 1);

  const availableLocations = AVAILABLE_LOCATIONS.filter(
    (location) => !INTERESTING_LOCATIONS.includes(location)
  );

  // apply out of band swap to update the available locations
  res.send(`
    <ul id="available-locations" class="locations" hx-swap-oob="true">
      ${availableLocations.map((location) => renderLocation(location)).join("")}
    </ul> 
  `);
});

app.listen(3000);
