module.exports = async function ($) {
  return await $.keep($.params.query, async ($) => ['something', 'other'])
}
