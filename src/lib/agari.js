import _ from 'lodash'
import type2size from './type'

const AgariType = {
  LiangMian: 0,
  QianZhang: 1,
  BianZhang: 2,
  DuiPeng: 3,
  DanQi: 4,
  Unknown: 5,
}

//sorted need
function JudgeAgariType(lastDazi, agari) {
  var judgeFuncs = [
    JudgeShunziAgariType,
    JudgeKeziAgariType,
    JudgeDuiziAgariType,
  ]
  for (let judgeFunc of judgeFuncs) {
    let type = judgeFunc(lastDazi, agari)
    if (type !== AgariType.Unknown) {
      return type
    }
  }
  return AgariType.Unknown
}

function JudgeShunziAgariType(lastDazi, agari) {
  if (!lastDazi.shunzi) {
    return AgariType.Unknown
  }
  var cards = lastDazi.cards
  if (cards[1].equal(agari)) {
    return AgariType.QianZhang
  } else if (
    (_.first(cards).value =
      (1 && _.last(cards).equal(agari)) ||
      (_.last(cards).value === type2size[_.last(cards).type] &&
        _.first(cards).equal(agari)))
  ) {
    return AgariType.DanBian
  } else if (_.first(cards).equal(agari) || _.last(cards).equal(agari)) {
    return AgariType.LiangMian
  }
  return AgariType.Unknown
}

function JudgeKeziAgariType(lastDazi, agari) {
  if (!lastDazi.kezi) {
    return AgariType.Unknown
  }
  var cards = lastDazi.cards
  if (_.first(cards).equal(agari)) {
    return AgariType.DuiPeng
  }
  return AgariType.Unknown
}

function JudgeDuiziAgariType(lastDazi, agari) {
  if (!lastDazi.duizi) {
    return AgariType.Unknown
  }
  var cards = lastDazi.cards
  if (_.first(cards).equal(agari)) {
    return AgariType.DanQi
  }
  return AgariType.Unknown
}

export { AgariType, JudgeAgariType }
