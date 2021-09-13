module.exports = async function($) {
  $.page.title = 'Compile Backtick'
  function hello(type) {
    return $.t(`name.${type}`)
  }
  return `<div>${hello}</div>`
}