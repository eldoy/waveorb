module.exports = function halt(msg, data) {
  const e = new Error(msg)
  e.data = data
  throw e
}
