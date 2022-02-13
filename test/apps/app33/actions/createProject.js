module.exports = async function($) {
  await $.validate()
  return { hello: $.valid }
}
