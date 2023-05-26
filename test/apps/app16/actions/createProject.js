module.exports = async function ($) {
  return await $.remove($.params.query, ['evil'])
}
