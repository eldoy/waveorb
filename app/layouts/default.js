module.exports = async function($) {
  function current() {
    var a = q(`nav a[href="${ location.pathname }"]`) || q('nav a')
    a.classList.add('active-link')
  }
  return /* html */`
    <!doctype html>
    <html lang="en">
      <head>
        <meta http-equiv="content-type" content="text/html; charset=utf-8">
        <title>${ $.page.title || 'Presang' }</title>
        ${ $.style('/bundle.css') }
        ${ $.script('/bundle.js') }
      </head>
      <body>
      <div class="content">
          <nav>
            <a href="/">home</a>
            <a href="/about.html">about</a>
          </nav>
          <div class="main">${ $.page.content }</div>
        </div>
        <script>${ current }; current()</script>
      </body>
    </html>`
}
