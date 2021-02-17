/* createProject */
module.exports = {
  deny: {
    query: ['evil']
  },
  allow: {
    query: ['something']
  },
  main: async function($) {
    const query = $.params.query || { hello: 'bye' }
    return { query }
  }
}
