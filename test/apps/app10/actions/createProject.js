/* createProject */
module.exports = async function($) {
  await $.deny({ query: ['evil'] })
  await $.allow({ query: ['something'] })
  const query = $.params.query || { hello: 'bye' }
  return { query }
}
