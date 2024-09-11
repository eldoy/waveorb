module.exports = async function ($) {
  return await $.keep($.params.query, ['something.a', 'other'])
}
