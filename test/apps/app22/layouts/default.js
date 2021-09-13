module.exports = async function($) {
  return `
    <!doctype html>
    <html>
      <head><title>${$.page.title}</title></head>
      <body>
        ${$.page.content}
      </body>
    </html>`
}