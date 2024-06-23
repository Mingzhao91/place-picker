export default function renderLocation(location, isAvailableLocation = true) {
  let attributes;

  if (isAvailableLocation) {
    // remove location from the ul#available-locations
    // add location to #interesting-locations
    attributes = `
      hx-post="/places"
      hx-vals='{"locationId": "${location.id}"}'
      hx-target="#interesting-locations"
      hx-swap="beforeend show:#int-locations-section:top"
      data-action="add"
    `;
  } else {
    // remove location from the ul#interesting-locations
    // add location to #available-locations
    attributes = `
      hx-delete="/places/:${location.id}"
      hx-target="closest li"
      hx-swap="outerHTML"
      data-action="remove"
    `;
  }

  return `
    <li class="location-item">
      <button ${attributes}>
        <img src="${`/images/${location.image.src}`}" alt="${
    location.image.alt
  }" />
        <h3>${location.title}</h3>
      </button>
    </li>
  `;
}
