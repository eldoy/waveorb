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

  it('should sort by number', () => {
    let result = tools.sortByNumber(['222', '2', '1_a', '11_a', 'aa'])
    expect(result).toEqual(['aa', '1_a', '2', '11_a', '222'])
  })
})
