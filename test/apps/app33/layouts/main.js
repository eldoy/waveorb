module.exports = async function ($) {
  return /* HTML */ `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Title</title>
      </head>
      <body>
        <header>This is the header</header>
        ${$.page.content}
      </body>
    </html>`
}
