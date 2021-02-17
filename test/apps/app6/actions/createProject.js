/* createProject */
module.exports = {
  filters: async function($) {
    return ['authenticate', 'nested/logger']
  },
  main: async function($) {
    return { hello: $.hello, logger: $.logger }
  }
}
