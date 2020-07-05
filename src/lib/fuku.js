import { CheckExceptionalAgari, CheckFuncMap } from './check'
import { Kanzi, Is19Menzu } from './menzu'
import { JudgeAgariType, AgariType } from './agari'
import _ from 'lodash'

const baseFuku = 20

function CalcFuku(ctx, comp) {
  var fuku = preCalc(ctx, comp)
  if (fuku !== 0) return fuku
  return (
    baseFuku +
    calcTsumoFuku(ctx) +
    calcMenzuFuku(comp) +
    calcDuiziFuku(ctx, comp) +
    calcAgariType(ctx, comp)
  )
}

function calcTsumoFuku(ctx) {
  if (ctx.menzen && !ctx.tsumo) return 10
  if (ctx.tsumo) return 2
  return 0
}

function calcMenzuFuku(comp) {
  var total = 0
  comp.menzus.forEach(menzu => {
    let menzuFuku = 0
    if (menzu.shunzi) menzuFuku = 0
    else if (Kanzi(menzu.cards)) menzuFuku = menzu.ura ? 16 : 8
    else if (menzu.kezi) menzuFuku = menzu.ura ? 4 : 2
    menzuFuku *= Is19Menzu(menzu) ? 2 : 1
    total += menzuFuku
  })
  return total
}

function calcDuiziFuku(ctx, comp) {
  var total = 0
  var queTou = _.first(comp.duizis)
  if (queTou.type === 'y') total += 2
  if (queTou.has(ctx.jifu)) total += 2
  if (queTou.has(ctx.chanfu)) total += 2
  return total
}

function calcAgariType(ctx, comp) {
  var agariType = JudgeAgariType(comp.lastDazi, ctx.agariCard)
  switch (agariType) {
    case AgariType.DanQi:
      return 2
    case AgariType.BianZhang:
      return 2
    case AgariType.QianZhang:
      return 2
    default:
      return 0
  }
}

function preCalc(ctx, comp) {
  if (CheckExceptionalAgari(ctx, comp)) return 25
  if (ctx.tsumo && CheckFuncMap[4](ctx, comp)) return 20
  if (noMenzen4Shunzi(ctx, comp)) return 30
}

function noMenzen4Shunzi(ctx, comp) {
  if (ctx.menzen) return false
  if (comp.menzus.length !== 4) return false
  for (let menzu of comp.menzus) {
    if (!menzu.shunzi) return false
  }
  return true
}

export { CalcFuku }
