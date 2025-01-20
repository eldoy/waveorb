module.exports = async function ($) {
  await $.validate({
    query: {
      id: {
        required: true
      }
    },
    values: {
      name: {
        required: true
      }
    }
  })

  return { hello: 'bye' }
}
