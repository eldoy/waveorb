module.exports = async function ($) {
  await $.validate('userCreate')
  return { hello: 'bye' }
}
