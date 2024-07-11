export default function locationDetail(location) {
  return `
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
  `;
}
