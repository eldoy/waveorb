/* createProject */
module.exports = {
  keep: async function($) {
    return ['something', 'other']
  },
  main: async function($) {
    return { evil: 1, something: 2, other: 3 }
  }
}
