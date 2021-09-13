module.exports = async function($) {
  $.page.title = 'Compile'
  function hello() {
    return $.t('name')
  }
  return `<div>${hello}</div>`
}