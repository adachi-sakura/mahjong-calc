function InsertCard(card, destArr) {
  for (var i = 0, len = destArr.length; i < len; i++) {
    if (destArr[i].score >= card.score) {
      break
    }
  }
  destArr.splice(i, 0, card)
}

function RangeBetween(start, end) {
  return Array.from(new Array(end + 1).keys()).slice(start)
}

function Range(end) {
  return RangeBetween(0, end - 1)
}

export { InsertCard, Range, RangeBetween }
