import { Is19, Card } from './card'

class Menzu {
  constructor() {
    this.shunzi = false
    this.kezi = false
    this.duizi = false
    this.ura = false
    this.type = ''
    this.cards = []
  }

  generate(isUra) {
    this.ura = isUra
    this.shunzi = Shunzi(this.cards)
    this.kezi = Kezi(this.cards)
    this.duizi = Duizi(this.cards)
    if (!this.shunzi && !this.kezi && !this.duizi) {
      throw 'generation failed'
    }
    this.type = this.cards[0].type
  }

  toString() {
    var ret = ''
    this.cards.forEach(card => (ret += card.score.toString()))
    return ret
  }

  static fromString(strArr, isUra) {
    var newMenzu = new Menzu()
    strArr.forEach(cardStr => {
      newMenzu.cards.push(Card.fromString(cardStr))
    })
    newMenzu.cards.sort((a, b) => a.score - b.score)
    try {
      newMenzu.generate(isUra)
    } catch (err) {
      return null
    }

    return newMenzu
  }

  has(target) {
    for (let card of this.cards) {
      if (card.equal(target)) {
        return true
      }
    }
    return false
  }

  nonTypeString() {
    var ret = ''
    this.cards.forEach(card => (ret += card.value.toString()))
    return ret
  }

  static Instance(cards) {
    var instance = new Menzu()
    instance.cards = cards
    instance.generate(true)

    return instance
  }
}

function Kezi(menzu) {
  var len = menzu.length
  if (len < 3 || len > 4) {
    return false
  }
  var s = new Set()
  menzu.forEach(card => s.add(card.score))
  return s.size === 1
}

function Kanzi(menzu) {
  return menzu.length === 4 && Kezi(menzu)
}

function Shunzi(menzu) {
  var len = menzu.length
  if (len != 3) {
    return false
  }

  return menzu[0].IsPrev(menzu[1]) && menzu[1].IsPrev(menzu[2])
}

function Duizi(dazi) {
  var len = dazi.length
  if (len != 2) {
    return false
  }

  return dazi[0].equal(dazi[1])
}

function Is19Menzu(menzu) {
  for (let card of menzu.cards) {
    if (Is19(card)) {
      return true
    }
  }
  return false
}

export { Menzu, Kezi, Shunzi, Kanzi, Duizi, Is19Menzu }
