module.exports = async function ($) {
  await $.remove($.params.query, ['evil', 'something.a'])
  return $.params.query
}
