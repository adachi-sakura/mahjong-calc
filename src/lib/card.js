import { type2size, IsCharacterType } from './type'

const type2base = {
  m: 0,
  p: 1,
  s: 2,
  f: 3,
  y: 4,
}

function IsCharacterCard(card) {
  return card.type === 'f' || card.type === 'y'
}

function Is19(card) {
  return (card.value === 1 || card.value === 9) && !IsCharacterCard(card)
}

class Card {
  constructor(val, type) {
    console.assert(
      Object.prototype.hasOwnProperty.call(type2size, type),
      'type invalid'
    )
    console.assert((type != 'f' && type != 'y') || val != 0, 'aka invalid')
    console.assert(val >= 0 && val <= type2size[type], 'value invalid')
    this.value = val === 0 ? 5 : val
    this.type = type
    this.aka = val === 0 ? true : false
    this.score = type2base[this.type] * 10 + this.value
  }

  name() {
    if (this.aka === true) {
      return '0' + this.type
    }
    return this.value + this.type
  }

  equal(card) {
    return card && this.score === card.score
  }

  IsPrev(card) {
    return (
      card &&
      this.type === card.type &&
      IsCharacterType(this.type) &&
      this.value + 1 === card.value
    )
  }

  IsNext(card) {
    return (
      card &&
      this.type === card.type &&
      IsCharacterType(this.type) &&
      this.value - 1 === card.value
    )
  }

  static fromString(str) {
    if (str.length !== 2) throw 'invalid string'
    var val = str.charAt(0),
      type = str.charAt(1)
    if (!Object.prototype.hasOwnProperty.call(type2size, type))
      throw 'invalid string'
    if (val < 0 || val > type2size[type]) throw 'invalid string'
    if (IsCharacterType(type) && val === 0) throw 'invalid string'
    return new Card(val, type)
  }
}

function Name(val, type) {
  return val + type
}

export { IsCharacterCard, Is19, Card, Name }
