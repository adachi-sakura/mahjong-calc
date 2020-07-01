class CardsStatus {
  constructor(cards, tempCur = 0) {
    this.cards = cards
    this.tempCur = Math.min(tempCur, this.cards.length)
  }

  Card() {
    if (this.tempCur >= this.cards.length) {
      return null
    }
    return this.cards[this.tempCur]
  }

  at(idx) {
    if (idx >= this.cards.length) {
      return null
    }
    return this.cards[idx]
  }

  Next() {
    return new CardsStatus(this.cards, this.tempCur + 1)
  }

  NextDifferent() {
    var cur = this.tempCur
    var anchor = this.Card()
    while (cur < this.cards.length && anchor.equal(this.at(cur))) {
      cur++
    }
    return new CardsStatus(this.cards, cur)
  }
}

export { CardsStatus }
