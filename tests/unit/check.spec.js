import { CheckFuncMap } from '../../src/lib/check'
import { NewContext } from '../../src/lib/testutil'
import { GenerateCompositions } from '../../src/lib/composition'

describe('check test', () => {
  it('合法平和检测', () => {
    let ctx = NewContext(
      [
        '1s',
        '1s',
        '2s',
        '3s',
        '4s',
        '5s',
        '6s',
        '7s',
        '3m',
        '4m',
        '5m',
        '6m',
        '7m',
      ],
      [],
      '5m'
    )
    let comps = GenerateCompositions(ctx.tehai, ctx.agariCard)
    let checkFunc = CheckFuncMap[4]
    let flag = false
    comps.forEach(comp => {
      comp.lint(ctx.fuuro, ctx.tsumo)
      flag = flag || checkFunc(ctx, comp)
    })
    expect(flag).toBe(true)
  })
})
