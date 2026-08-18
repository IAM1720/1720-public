export async function onRequest(context) {
  const client_id = context.env.GITHUB_CLIENT_ID;
  const client_secret = context.env.GITHUB_CLIENT_SECRET;
  const url = new URL(context.request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return new Response("Missing authorization code", { status: 400 });
  }

  try {
    const response = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ client_id, client_secret, code }),
    });

    const data = await response.json();

    if (data.error) {
      return new Response(`OAuth Error: ${data.error_description || data.error}`, { status: 400 });
    }

    const token = data.access_token;
    const provider = "github";

    // Safely encode content to prevent quotes from breaking the inline JavaScript snippet
    const content = token
      ? `authorization:${provider}:success:${JSON.stringify({ token, provider })}`
      : `authorization:${provider}:error:${JSON.stringify(data)}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authenticating...</title>
        </head>
        <body>
          <p>Connecting to Decap CMS...</p>
          <script>
            (function() {
              const content = ${JSON.stringify(content)};
              
              function receiveMessage(e) {
                if (window.opener) {
                  window.opener.postMessage(content, "*");
                }
              }
              
              window.addEventListener("message", receiveMessage, false);
              
              if (window.opener) {
                window.opener.postMessage("authorizing:${provider}", "*");
              }
            })();
          </script>
        </body>
      </html>
    `;

    return new Response(html, {
      headers: {
        "Content-Type": "text/html;charset=UTF-8",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (err) {
    return new Response(`Server error: ${err.message}`, { status: 500 });
  }
}