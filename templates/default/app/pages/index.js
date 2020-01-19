module.exports = async function($) {
  $.page.title = 'Home'

  return /* html */`
    <h1>home</h1>
    <p>
      this is your shiny new blazing fast
      <a href="https://github.com/eldoy/presang" target="_blank">presang app!</a>
    </p>
  `
}
