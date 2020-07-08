import { NewContext } from '../../src/lib/testutil'

describe('New Context test', () => {
  it('create right context', () => {
    const ctx = NewContext(
      [
        '1s',
        '1s',
        '1s',
        '2s',
        '2s',
        '2s',
        '3s',
        '3s',
        '3s',
        '4s',
        '4s',
        '4s',
        '5s',
      ],
      [],
      '5s'
    )
    expect(ctx.tehai.length).toBe(13)
    expect(ctx.fuuro.length).toBe(0)
  })
})
