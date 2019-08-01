const tools = require('../lib/tools.js')

describe('tools', () => {
  it('should convert object string to javascript object', () => {
    const str = '{ name: \'hello\' }'
    const result = tools.toObject(str)
    expect(result.constructor).toBe(Array)
    expect(result[0].name).toEqual('hello')
  })

  it('should convert object string to javascript object', () => {
    const str = '{ name: "hello" }, { name: \'bye\' }'
    const result = tools.toObject(str)
    expect(result.constructor).toBe(Array)
    expect(result[0].name).toEqual('hello')
    expect(result[1].name).toEqual('bye')
  })
})
