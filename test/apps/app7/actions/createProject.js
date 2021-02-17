/* createProject */
module.exports = {
  validate: {
    data: {
      name: {
        minlength: 5
      },
      key: {
        in: [7, 8]
      }
    }
  },
  main: async function($) {
    return { hello: 'bye' }
  }
}
