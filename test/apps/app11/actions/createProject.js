module.exports = async function ($) {
  await $.deny({ query: async ($) => ['evil'] })
  await $.allow({ query: async ($) => ['something'] })
  var query = $.params.query || { hello: 'bye' }
  return { query }
}
