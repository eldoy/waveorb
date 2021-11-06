module.exports = async function($) {
  await $.validate({
    query: {
      name: {
        minlength: 5
      },
      key: {
        in: [7, 8]
      }
    }
  })
  return { hello: 'bye' }
}
