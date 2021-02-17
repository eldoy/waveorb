/* createProject */
module.exports = {
  before: async function($) {
    return { hello: 'before' }
  },
  main: async function($) {
    $.result = { hello: 'main' }
  },
  after: async function($) {
    return $.result
  }
}
