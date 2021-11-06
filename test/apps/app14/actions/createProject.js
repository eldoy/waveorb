module.exports = async function($) {
  await $.keep($.params.query, async $ => ['something', 'other'])
  return $.params.query
}
