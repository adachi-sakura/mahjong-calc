import _ from 'lodash'
import InsertCard from './util'
import CardsStatus from './cardsStatus'
import Menzu from './menzu'

class Composition {
  constructor() {
    this.menzus = []
    this.duizis = []
    this.lastDazi = null
  }

  lint(fuuro, isTsumo) {
    this.menzus = this.menzus.concat(fuuro)
    this.lastDazi.ura = isTsumo
  }
}

function GenerateCompositions(tehai, agariCard) {
  var cards = _.clone(tehai)
  InsertCard(agariCard, cards)
  var countDict = {}
  for (let card of cards) {
    countDict[card.score] = countDict[card.score]
      ? countDict[card.score] + 1
      : 1
  }
  var usedDict = {}
  for (let key in countDict) {
    usedDict[key] = 0
  }

  var data = {
    cards: cards,
    agariCard: agariCard,
    countDict: countDict,
  }
  var ctx = {
    //cur: 0,
    cardsRemain: _.cloneDeep(cards),
    composition: new Composition(),
    usedDict: usedDict,
  }
  return parseToComposition(ctx, data)
}

function parseToComposition(ctx, data) {
  // console.assert(ctx.cur <= data.cards.length, 'ctx cur invalid')
  if (ctx.cardsRemain.length === 0) {
    return [ctx.composition]
  }
  var funcs = [parseFirstKezi, parseFirstShunzi, parseFirstDuizi]
  var comps = []
  for (let parseFunc of funcs) {
    let newDazi = parseFunc(ctx.cardsRemain)
    if (newDazi == null) {
      continue
    }
    let newCtxs = createNewParseCtx(ctx, data, newDazi)
    newCtxs.forEach(
      newCtx => (comps = comps.concat(parseToComposition(newCtx, data)))
    )
  }
  return comps
}

function createNewParseCtx(ctx, data, newDazi) {
  var newCtxs = []
  var newCtx = _.cloneDeep(ctx)

  var map = new Map()
  for (let card of newDazi.cards) {
    let score = card.score
    map.set(score, map.has(score) ? map.get(score) + 1 : 1)
  }

  _.remove(newCtx.cardsRemain, function(card) {
    if (map.get(card.score)) {
      let cnt = map.get(card.score) - 1
      map.set(card.score, cnt === 0 ? undefined : cnt)
      return true
    }
    return false
  })

  newDazi.cards.forEach(card => newCtx.usedDict[card.score]++)
  //newCtx.cur = NewPosition(newCtx, data, newDazi)
  var compositions = newCompositions(newCtx, data, newDazi)
  for (let comp of compositions) {
    let c = _.cloneDeep(newCtx)
    c.composition = comp
    newCtxs.push(c)
  }
  return newCtxs
}

function newCompositions(ctx, data, newDazi) {
  console.assert(newDazi.cards.length === 2 || newDazi.cards.length === 3)
  var comp = ctx.composition
  switch (newDazi.cards.length) {
    case 3:
      comp.menzus.push(newDazi)
      break
    case 2:
      comp.duizis.push(newDazi)
      break
  }
  if (
    comp.lastDazi != null ||
    newDazi.cards.find(elem => elem.score === data.agariCard.score) == undefined
  ) {
    return [comp]
  }
  if (
    ctx.usedDict[data.agariCard.score] === data.countDict[data.agariCard.score]
  ) {
    comp.lastDazi = newDazi
    return [comp]
  }
  var comp2 = _.cloneDeep(comp)
  comp.lastDazi = newDazi
  return [comp, comp2]
}

function FilterCompositions(comps) {
  comps.forEach(comp => {
    comp.menzus.sort()
    comp.duizis.sort()
  })

  var set = new Set()
  _.remove(comps, function(comp) {
    let json = JSON.stringify(comp)
    if (set.has(json)) {
      return true
    }
    set.add(json)
    return false
  })
}

function parseFirstKezi(cardsRemain) {
  // try {
  //   if (
  //     data.cards[ctx.cur].equal(data.cards[ctx.cur + 1]) &&
  //     data.cards[ctx.cur].equal(data.cards[ctx.cur + 2])
  //   ) {
  //     keziCards.push(data.cards[ctx.cur])
  //     keziCards.push(data.cards[ctx.cur + 1])
  //     keziCards.push(data.cards[ctx.cur + 2])
  //   }
  // } catch (err) {
  // } finally {
  //   return keziCards
  // }
  var status = new CardsStatus(cardsRemain)
  var nStatus = status.Next()
  var nnStatus = nStatus.Next()
  var [curCard, nCard, nnCard] = [
    status.Card(),
    nStatus.Card(),
    nnStatus.Card(),
  ]
  if (curCard && curCard.equal(nCard) && nCard.equal(nnCard)) {
    return Menzu.Instance([curCard, nCard, nnCard])
  }
  return null
}

function parseFirstShunzi(cardsRemain) {
  // var shunziCards = []
  // var preCard = data.cards[ctx.cur]
  // shunziCards.push(preCard)
  // for (let pos = ctx.cur + 1; pos < data.cards.length; pos++) {
  //   let curCard = data.cards[pos]
  //   if (curCard.type != preCard.type) {
  //     return []
  //   }
  //   if (curCard.value === preCard.value + 1) {
  //     shunziCards.push(curCard)
  //     if (shunziCards.length === 3) {
  //       return shunziCards
  //     }
  //     preCard = curCard
  //   }
  // }
  var status = new CardsStatus(cardsRemain)
  var nStatus = status.NextDifferent()
  var nnStatus = nStatus.NextDifferent()
  var [curCard, nCard, nnCard] = [
    status.Card(),
    nStatus.Card(),
    nnStatus.Card(),
  ]
  if (curCard && curCard.IsPrev(nCard) && nCard.IsPrev(nnCard)) {
    return Menzu.Instance([curCard, nCard, nnCard])
  }
  return null
}

function parseFirstDuizi(cardsRemain) {
  // var duiziCards = []
  // try {
  //   if (data.cards[ctx.cur].equal(data.cards[ctx.cur + 1])) {
  //     duiziCards.push(data.cards[ctx.cur])
  //     duiziCards.push(data.cards[ctx.cur + 1])
  //   }
  // } catch (err) {
  // } finally {
  //   return duiziCards
  // }
  var status = new CardsStatus(cardsRemain)
  var nStatus = status.Next()
  var [curCard, nCard] = [status.Card(), nStatus.Card()]
  if (curCard && curCard.equal(nCard)) {
    return Menzu.Instance([curCard, nCard])
  }
  return null
}

export { Composition, GenerateCompositions, FilterCompositions }
