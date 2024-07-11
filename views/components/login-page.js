export default function loginPage() {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Learn HTMX</title>
        <link rel="icon" href="/images/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/main.css" />
        <script src="/htmx.js" defer></script>
        <script src="/htmx-response-targets.js" defer></script>
      </head>
      <body>
        <main>
          <!-- 'this' refers to 'form' -->
          <form
            hx-ext="response-targets"
            hx-post="/login" 
            hx-headers='{"x-csrf-token": "testing-token"}'
            hx-target-422="#extra-information"
            hx-target-500="#server-side-error"
            hx-sync="this:replace"
            >
            <div>
              <img src="/images/auth-icon.jpg" alt="A lock icon" />
            </div>
            <div id="server-side-error"></div>
            <div class="control">
              <label for="email">Email</label>
              <input 
                hx-post="/validate" 
                hx-target="next p"
                hx-params="email"
                hx-headers='{"x-csrf-token": "testing-token"}'
                type="email" 
                name="email" 
                id="email" />
              <p class="error"></p>
            </div>
            <div class="control">
              <label for="password">Password</label>
              <input 
                hx-post="/validate" 
                hx-target="next p"
                hx-params="password"
                hx-headers='{"x-csrf-token": "testing-token"}'
                type="password" 
                name="password" 
                id="password" />
              <p class="error"></p>
            </div>
            <div id="extra-information">
            </div>
            <p>
              <button type="submit">
                Login
              </button>
            </p>
          </form>
        </main>
      </body>
    </html>
  `;
}
