module.exports = async function ($) {
  await $.keep($.params.query, ['something.a', 'other'])
  return $.params.query
}
