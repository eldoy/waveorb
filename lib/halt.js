module.exports = function halt(msg, data) {
  const e = new Error(msg)
  if (data) e.data = data
  throw e
}