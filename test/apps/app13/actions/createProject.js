/* createProject */
module.exports = {
  keep: ['something', 'other'],
  main: async function($) {
    return { evil: 1, something: 2, other: 3 }
  }
}
