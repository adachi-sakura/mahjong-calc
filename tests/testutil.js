import Context from '../src/lib/context'
import Card from '../src/lib/card'
import Menzu from '../src/lib/menzu'
import InsertCard from '../src/lib/util'

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
