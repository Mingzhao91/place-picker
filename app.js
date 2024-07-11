import express from "express";

import { AVAILABLE_LOCATIONS } from "./data/available-locations.js";
import renderLocationsPage from "./views/index.js";
import renderLocation from "./views/components/location.js";
import loginPage from "./views/components/login-page.js";
import locationDetail from "./views/components/location-detail.js";

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

app.get("/login-page", (req, res) => {
  res.send(loginPage());
});

app.post("/validate", (req, res) => {
  if ("email" in req.body && !req.body.email.includes("@")) {
    return res.send(`
      E-Mail address is invalid.
    `);
  } else if ("email" in req.body && req.body.email.includes("@")) {
    return res.send();
  } else if ("password" in req.body && req.body.password.trim().length < 8) {
    return res.send(`
      Password must be at least 8 characters long.
    `);
  } else if ("password" in req.body && req.body.password.trim().length >= 8) {
    return res.send();
  }
  res.send();
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  let errors = {};

  if (!email || !email.includes("@")) {
    errors.email = "Please enter a valid email address.";
  }

  if (!password || password.trim().length < 8) {
    errors.password = "Password must be at least 8 characters long.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).send(`
        <ul id="form-errors">
          ${Object.keys(errors)
            .map((key) => `<li>${errors[key]}</li>`)
            .join("")}
        </ul>
    `);
  }

  if (Math.random() > 0.5) {
    return res.status(500).send(`
      <p class="error">A server-side error occurred. Please try again.</p>
    `);
  }

  res.setHeader("HX-Redirect", "/");
  res.send();
});

app.get("/places/:id", (req, res) => {
  const placeId = req.params.id;
  const location = AVAILABLE_LOCATIONS.find(
    (location) => location.id === placeId
  );

  res.send(locationDetail(location));
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
