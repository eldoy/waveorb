/* createProject */
module.exports = {
  filters: ['authenticate', 'nested/logger'],
  main: async function($) {
    return { hello: $.hello, logger: $.logger }
  }
}
