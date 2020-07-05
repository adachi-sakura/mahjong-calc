import YakuMetaRequirement from './yaku'
import _ from 'lodash'
import { Card, Is19, IsCharacterCard } from './card'
import { JudgeAgariType, AgariType } from './agari'
import { type2size, IsCharacterType } from './type'
import { Kanzi, Is19Menzu } from './menzu'

function checkChiduiAgari(ctx, comp) {
  return checkYaku17(ctx, comp)
}

function checkGokushiAgari(ctx) {
  return checkYaku31(ctx) || checkYaku42(ctx)
}

function CheckExceptionalAgari(ctx, comp) {
  return checkChiduiAgari(ctx, comp) || checkGokushiAgari(ctx)
}

function CheckClassicalAgari(comp) {
  return new YakuMetaRequirement(4, 1).Validate(comp)
}

function CheckComposition(ctx, comp) {
  return CheckClassicalAgari(comp) || CheckExceptionalAgari(ctx, comp)
}

const CheckFuncMap = {
  1: checkYaku1,
  2: checkYaku2,
  3: checkYaku3,
  4: checkYaku4,
  5: checkYaku5,
  6: checkYaku6,
  7: checkYaku7,
  8: checkYaku8,
  9: checkYaku9,
  10: checkYaku10,
  11: checkYaku11,
  12: checkYaku12,
  13: checkYaku13,
  14: checkYaku14,
  15: checkYaku15,
  16: checkYaku16,
  17: checkYaku17,
  18: checkYaku18,
  19: checkYaku19,
  20: checkYaku20,
  21: checkYaku21,
  22: checkYaku22,
  23: checkYaku23,
  24: checkYaku24,
  25: checkYaku25,
  26: checkYaku26,
  27: checkYaku27,
  28: checkYaku28,
  29: checkYaku29,
  30: checkYaku30,
  31: checkYaku31,
  32: checkYaku32,
  33: checkYaku33,
  34: checkYaku34,
  35: checkYaku35,
  36: checkYaku36,
  37: checkYaku37,
  38: checkYaku38,
  39: checkYaku39,
  40: checkYaku40,
  41: checkYaku41,
  42: checkYaku42,
  43: checkYaku43,
  44: checkYaku44,
  45: checkYaku45,
}

//1 立直
const checkYaku1 = function(ctx) {
  if (!ctx.riichi) {
    return false
  }
  if (ctx.menzen) {
    throw '必须在门清状态下立直'
  }
  if (ctx.wriichi) {
    throw '无法与双立直同时生效'
  }

  return true
}

//2 一发
const checkYaku2 = function(ctx) {
  if (!ctx.ippatsu) {
    return false
  }
  if (!ctx.riichi && !ctx.wriichi) {
    throw '一发必须复合立直'
  }
  return true
}

//3 门前自摸
const checkYaku3 = function(ctx) {
  return ctx.menzen && ctx.tsumo
}

//4 平和
const checkYaku4 = function(ctx, comp) {
  var agariType = JudgeAgariType(comp.lastDazi, ctx.agariCard)
  if (agariType !== AgariType.LiangMian) {
    return false
  }
  for (let menzu of comp.menzus) {
    if (menzu.shunzi === false) {
      return false
    }
  }
  for (let duizi of comp.duizis) {
    if (
      _.first(duizi).name() === ctx.chanfu ||
      _.first(duizi).name() === ctx.jifu
    ) {
      return false
    }
  }
  return true
}

//5 断幺
const checkYaku5 = function(ctx) {
  var checkFunc = card => {
    if (IsCharacterCard(card) || Is19(card)) {
      return false
    }
    return true
  }

  for (let menzu of ctx.fuuro) {
    for (let card of menzu) {
      if (!checkFunc(card)) {
        return false
      }
    }
  }
  for (let card of ctx.tehai) {
    if (!checkFunc(card)) {
      return false
    }
  }
  return checkFunc(ctx.agariCard)
}

//6 一杯口
const checkYaku6 = function(ctx, comp) {
  var s = new Set()
  var hasDuplicate = new Set()
  comp.menzus.forEach(menzu => {
    var str = menzu.toString()
    if (s.has(str)) {
      hasDuplicate.add(str)
    }
    s.add(str)
  })
  return hasDuplicate.size == 1
}

//7 场风
const checkYaku7 = function(ctx, comp) {
  for (let menzu of comp.menzus) {
    if (menzu.has(ctx.chanfu)) {
      return true
    }
  }
  return false
}

//8 自风
const checkYaku8 = function(ctx, comp) {
  for (let menzu of comp.menzus) {
    if (menzu.has(ctx.jifu)) {
      return true
    }
  }
  return false
}

//9 白
const checkYaku9 = function(ctx, comp) {
  for (let menzu of comp.menzus) {
    if (menzu.has(new Card(1, 'y'))) {
      return true
    }
  }
  return false
}

//10 发
const checkYaku10 = function(ctx, comp) {
  for (let menzu of comp.menzus) {
    if (menzu.has(new Card(2, 'y'))) {
      return true
    }
  }
  return false
}

//11 中
const checkYaku11 = function(ctx, comp) {
  for (let menzu of comp.menzus) {
    if (menzu.has(new Card(3, 'y'))) {
      return true
    }
  }
  return false
}

//12 海底
const checkYaku12 = function(ctx) {
  if (!ctx.haitei) {
    return false
  }
  if (!ctx.tsumo) {
    throw '海底必须自摸'
  }
  return true
}

//13 河底
const checkYaku13 = function(ctx) {
  if (!ctx.hotei) {
    return false
  }
  if (ctx.tsumo) {
    throw '河底无法自摸'
  }
  if (ctx.ippatsu) {
    throw '河底无法复合一发'
  }
  return true
}

//14 抢杠
const checkYaku14 = function(ctx) {
  if (!ctx.chankan) {
    return false
  }
  if (ctx.tsumo) {
    throw '抢杠无法自摸'
  }
  return true
}

//15 岭上
const checkYaku15 = function(ctx) {
  if (!ctx.linshan) {
    return false
  }
  if (!ctx.tsumo) {
    throw '岭上需要自摸'
  }
  for (let menzu of ctx.fuuro) {
    if (Kanzi(menzu.cards)) {
      return true
    }
  }
  throw '岭上需要副露存在杠'
}

//16 w立
const checkYaku16 = function(ctx) {
  if (!ctx.wriichi) {
    return false
  }
  if (ctx.menzen) {
    throw '必须在门清状态下双立直'
  }
  if (ctx.riichi) {
    throw '无法与立直同时生效'
  }

  return true
}

//17 七对
const checkYaku17 = function(ctx, comp) {
  if (comp.duizis.length !== 7) {
    return false
  }
  var s = new Set()
  for (let duizi of comp.duizis) {
    let str = duizi.toString()
    if (s.has(str)) {
      return false
    }
    s.add(str)
  }
  return true
}

//18 一气
const checkYaku18 = function(ctx, comp) {
  var dict = {}
  for (let type in type2size) {
    dict[type] = new Set()
  }
  comp.menzus.forEach(menzu => {
    if (menzu.shunzi) {
      dict[menzu.type].add(menzu.nonTypeString)
    }
  })

  for (let entry in dict) {
    let m = dict[entry]
    if (m.has('123') && m.has('456') && m.has('789')) {
      return true
    }
  }
  return false
}

//19 三色同顺
const checkYaku19 = function(ctx, comp) {
  var m = new Map()
  for (let menzu of comp.menzus) {
    if (!menzu.shunzi) {
      continue
    }
    let str = menzu.nonTypeString()
    m.set(str, m.has(str) ? m.get(str).add(menzu.type) : new Set())
  }
  for (let set of m.values()) {
    console.assert(set.size <= 3)
    if (set.size === 3) {
      return true
    }
  }
  return false
}

//20 混全
const checkYaku20 = function(ctx, comp) {
  var flagCharacter = false
  var checkFunc = function(menzu) {
    if (!Is19Menzu(menzu)) {
      return false
    }
    if (IsCharacterType(menzu.type)) {
      flagCharacter = true
    }
    return true
  }

  for (let menzu of comp.menzus) {
    if (!checkFunc(menzu)) {
      return false
    }
  }
  for (let duizi of comp.duizis) {
    if (!checkFunc(duizi)) {
      return false
    }
  }

  return flagCharacter
}

//21 三色同刻
const checkYaku21 = function(ctx, comp) {
  var m = new Map()
  for (let menzu of comp.menzus) {
    if (!menzu.kezi || IsCharacterType(menzu.type)) {
      continue
    }
    let str = menzu.nonTypeString()
    m.set(str, m.has(str) ? m.get(str).add(menzu.type) : new Set())
  }
  for (let set of m.values()) {
    console.assert(set.size <= 3)
    if (set.size === 3) {
      return true
    }
  }
  return false
}

//22 三暗刻
const checkYaku22 = function(ctx, comp) {
  var cnt = 0
  comp.menzus.forEach(menzu => {
    if (menzu.ura && menzu.kezi) {
      cnt++
    }
  })
  return cnt === 3
}

//23 对对和
const checkYaku23 = function(ctx, comp) {
  for (let menzu of comp.menzus) {
    if (!menzu.kezi) {
      return false
    }
  }
  return true
}

//24 小三元
const checkYaku24 = function(ctx, comp) {
  var mCnt = 0,
    dCnt = 0
  comp.menzus.forEach(menzu => {
    if (menzu.type == 'y') {
      mCnt++
    }
  })
  comp.duizis.forEach(duizi => {
    if (duizi.type == 'y') {
      dCnt++
    }
  })
  return mCnt === 2 && dCnt === 1
}

//25 混老头
const checkYaku25 = function(ctx, comp) {
  var flagCharacter = false
  var checkFunc = function(menzu) {
    if (!menzu.kezi && !menzu.duizi && !Is19Menzu(menzu)) {
      return false
    }
    if (IsCharacterType(menzu.type)) {
      flagCharacter = true
    }
    return true
  }

  for (let menzu of comp.menzus) {
    if (!checkFunc(menzu)) {
      return false
    }
  }
  for (let duizi of comp.duizis) {
    if (!checkFunc(duizi)) {
      return false
    }
  }

  return flagCharacter
}

//26 三杠子
const checkYaku26 = function(ctx, comp) {
  var cnt = 0
  comp.menzus.forEach(menzu => {
    if (Kanzi(menzu.cards)) {
      cnt++
    }
  })
  return cnt === 3
}

//27 混一色
const checkYaku27 = function(ctx, comp) {
  var flagCharacter = false,
    s = new Set()
  var checkFunc = function(menzu) {
    if (IsCharacterType(menzu.type)) {
      flagCharacter = true
    } else {
      s.add(menzu.type)
    }
  }
  comp.menzus.forEach(menzu => checkFunc(menzu))
  comp.duizis.forEach(duizi => checkFunc(duizi))
  return flagCharacter && s.size === 1
}

//28 纯全
const checkYaku28 = function(ctx, comp) {
  var checkFunc = function(menzu) {
    if (IsCharacterType(menzu.type)) {
      return false
    }
    if (!Is19Menzu(menzu)) {
      return false
    }

    return true
  }

  for (let menzu of comp.menzus) {
    if (!checkFunc(menzu)) {
      return false
    }
  }
  for (let duizi of comp.duizis) {
    if (!checkFunc(duizi)) {
      return false
    }
  }

  return true
}

//29 二杯口
const checkYaku29 = function(ctx, comp) {
  var s = new Set()
  var hasDuplicate = new Set()
  comp.menzus.forEach(menzu => {
    var str = menzu.toString()
    if (s.has(str)) {
      hasDuplicate.add(str)
    }
    s.add(str)
  })
  return hasDuplicate.size === 2
}

//30 清一色
const checkYaku30 = function(ctx, comp) {
  var s = new Set()
  for (let menzu of comp.menzus) {
    s.add(menzu.type)
    if (menzu.size > 1) {
      return false
    }
  }
  return true
}

//31 国士
const checkYaku31 = function(ctx) {
  if (ctx.fuuro.length > 0) {
    return false
  }
  var set = new Set()
  for (let card of ctx.tehai) {
    if (!Is19(card) && !IsCharacterCard(card)) {
      return false
    }
    set.add(card.score)
  }
  if (set.size() != 12) {
    return false
  }
  var agariCard = ctx.agariCard
  return (
    (Is19(agariCard) || IsCharacterCard(agariCard)) && !set.has(agariCard.score)
  )
}

//32 大三元
const checkYaku32 = function(ctx, comp) {
  var cnt = 0
  comp.menzus.forEach(menzu => {
    if (menzu.type === 'y') cnt++
  })
  return cnt === 3
}

//33 四暗刻
const checkYaku33 = function(ctx, comp) {
  var cnt = 0
  comp.menzus.forEach(menzu => {
    if (menzu.kezi && menzu.ura) cnt++
  })
  return (
    cnt === 4 &&
    JudgeAgariType(comp.lastDazi, ctx.agariCard) === AgariType.DuiPeng
  )
}

//34 小四喜
const checkYaku34 = function(ctx, comp) {
  var mCnt = 0,
    dCnt = 0
  comp.menzus.forEach(menzu => {
    if (menzu.type === 'f') mCnt++
  })
  comp.duizis.forEach(duizi => {
    if (duizi.type === 'f') dCnt++
  })
  return mCnt === 3 && dCnt === 1
}

//35 字一色
const checkYaku35 = function(ctx, comp) {
  for (let menzu of comp.menzus) {
    if (!IsCharacterType(menzu.type)) return false
  }
  for (let duizi of comp.duizis) {
    if (!IsCharacterType(duizi.type)) return false
  }
  return true
}

//36 绿一色
const checkYaku36 = function(ctx, comp) {
  var s = new Set(['2s', '3s', '4s', '6s', '8s'])
  var checkCard = function(menzu) {
    for (let card of menzu.cards) {
      if (!s.has(card.name())) return false
    }
  }
  for (let menzu of comp.menzus) {
    if (!checkCard(menzu)) return false
  }
  for (let duizi of comp.duizis) {
    if (!checkCard(duizi)) return false
  }
  return true
}

//37 清老头
const checkYaku37 = function(ctx, comp) {
  var checkFunc = function(menzu) {
    if (IsCharacterType(menzu.type)) {
      return false
    }
    if (!menzu.kezi && !menzu.duizi && !Is19Menzu(menzu)) {
      return false
    }

    return true
  }

  for (let menzu of comp.menzus) {
    if (!checkFunc(menzu)) return false
  }
  for (let duizi of comp.duizis) {
    if (!checkFunc(duizi)) return false
  }

  return true
}

//38 九莲宝灯
const checkYaku38 = function(ctx) {
  var type = null,
    dict = new Map()
  for (let card of ctx.tehai) {
    if (IsCharacterCard(card)) return false
    if (type != null && type !== card.type) return false
    type = card.type
    dict.set(card.value, dict.has(card.value) ? dict.get(card.value) + 1 : 1)
  }
  if (dict.get(1) !== 3 && dict.get(9) !== 3) return false
  return (
    dict.size === 8 &&
    type === ctx.agariCard.type &&
    !dict.has(ctx.agariCard.value)
  )
}

//39 四杠子
const checkYaku39 = function(ctx, comp) {
  var cnt = 0
  comp.menzus.forEach(menzu => {
    if (Kanzi(menzu.cards)) cnt++
  })
  return cnt === 4
}

//40 天和
const checkYaku40 = function(ctx) {
  if (!ctx.tenho) return false
  if (ctx.fuuro.length !== 0) throw '天和无法鸣牌(包括暗杠)'
  if (!ctx.jifu.equal(ctx.chanfu)) throw '天和需要自亲(场风与自风设置)'
  if (!ctx.tsumo) throw '天和需要自摸'
  if (ctx.riichi || ctx.wriichi) throw '天和无法立直'
  return true
}

//41 地和
const checkYaku41 = function(ctx) {
  if (!ctx.chiho) return false
  if (ctx.fuuro.length !== 0) throw '地和无法鸣牌(包括暗杠)'
  if (ctx.jifu.equal(ctx.chanfu)) throw '地和需要子家(场风与自风设置)'
  if (!ctx.tsumo) throw '地和需要自摸'
  if (ctx.riichi || ctx.wriichi) throw '地和无法立直'
  return true
}

const checkGokushiJusanmachiYaku = function(ctx) {
  if (ctx.fuuro.length > 0) {
    return false
  }
  var set = new Set()
  for (let card of ctx.tehai) {
    if (!Is19(card) && !IsCharacterCard(card)) {
      return false
    }
    set.add(card.score)
  }
  if (set.size() != 13) {
    return false
  }
  var agariCard = ctx.agariCard
  return Is19(agariCard) || IsCharacterCard(agariCard)
}

//42 国士十三面
const checkYaku42 = function(ctx) {
  return (
    checkGokushiJusanmachiYaku(ctx) || (checkYaku31(ctx) && ctx.tenho === true)
  )
}

//43 大四喜
const checkYaku43 = function(ctx, comp) {
  var cnt = 0
  comp.menzus.forEach(menzu => {
    if (menzu.type === 'f') cnt++
  })
  return cnt === 4
}

//44 四暗刻单骑
const checkYaku44 = function(ctx, comp) {
  var cnt = 0
  comp.menzus.forEach(menzu => {
    if (menzu.kezi && menzu.ura) cnt++
  })
  return (
    cnt === 4 &&
    JudgeAgariType(comp.lastDazi, ctx.agariCard) === AgariType.DanQi
  )
}

//45 纯九莲
const checkYaku45 = function(ctx) {
  var type = null,
    dict = new Map()
  for (let card of ctx.tehai) {
    if (IsCharacterCard(card)) return false
    if (type != null && type !== card.type) return false
    type = card.type
    dict.set(card.value, dict.has(card.value) ? dict.get(card.value) + 1 : 1)
  }
  if (dict.get(1) !== 3 && dict.get(9) !== 3) return false
  return dict.size === 9 && type === ctx.agariCard.type
}

export { CheckComposition, CheckFuncMap, CheckExceptionalAgari }
