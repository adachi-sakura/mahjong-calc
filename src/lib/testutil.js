import { Context } from './context'
import { Card } from './card'
import { Menzu } from './menzu'
import { InsertCard } from './util'

function NewContext(tehai, fuuro, agari) {
  var ctx = new Context()
  ctx.agariCard = Card.fromString(agari)
  var tehaiArr = []
  tehai.forEach(cardStr => {
    InsertCard(Card.fromString(cardStr), tehaiArr)
  })
  ctx.tehai = tehaiArr
  var fuuroArr = []
  fuuro.forEach(menzuStr => {
    fuuroArr.push(Menzu.fromString(menzuStr, false))
  })
  return ctx
}

export { NewContext }
