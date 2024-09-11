module.exports = async function($) {
  await $.validate({
    values: {
      name: {
        required: true
      },
      email: {
        required: true
      }
    }
  })
  return { hello: 'bye' }
}
