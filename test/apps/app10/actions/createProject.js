module.exports = async function ($) {
  await $.deny({ query: ['evil'] })
  await $.allow({ query: ['something'] })
  var query = $.params.query || { hello: 'bye' }
  return { query }
}
