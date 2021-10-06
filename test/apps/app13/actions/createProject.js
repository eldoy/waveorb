/* createProject */
module.exports = async function($) {
  await $.keep($.params.query, ['something', 'other'])
  return $.params.query
}
