module.exports = function hook(fn, ...args) {
  if (typeof fn == 'function') {
    return fn(...args)
  }
}
