import { type2size } from './type'
import { Card } from './card'

function IsDora(target, indicate) {
  if (indicate.type != target.type) {
    return false
  }
  return (indicate.value % type2size[indicate.type]) + 1 === target.value
}

function Dora(indicate) {
  return new Card(
    (indicate.value % type2size[indicate.type]) + 1,
    indicate.type
  )
}

function CalcDoraCount(cardArr, doraScores) {
  var total = 0
  for (let card of cardArr) {
    if (doraScores[card.score]) {
      total += doraScores[card.score]
    }
  }
  return total
}

export { Dora, IsDora, CalcDoraCount }
