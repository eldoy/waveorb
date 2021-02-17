/* updateProject */
module.exports = {
  main: async function($) {
    $.result = { hello: 'main' }
  },
  after: async function($) {
    return $.result
  }
}
