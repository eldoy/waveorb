/* createProject */
module.exports = {
  deny: {
    query: async function($) {
      return ['evil']
    }
  },
  allow: {
    query: async function($) {
      return ['something']
    }
  },
  main: async function($) {
    const query = $.params.query || { hello: 'bye' }
    return { query }
  }
}
