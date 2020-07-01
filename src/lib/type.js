const type2size = {
  m: 9, //m for man
  p: 9, //p for pin
  s: 9, //s for so
  f: 4, //f for fu
  y: 3, //y for yaku
}

function IsCharacterType(type) {
  return type === 'f' || type === 'y'
}

export { type2size, IsCharacterType }
