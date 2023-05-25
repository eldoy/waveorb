module.exports = async function($) {
  await $.remove($.params.query, ['evil'])
  return $.params.query
}
