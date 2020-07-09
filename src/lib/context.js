class Context {
  constructor() {
    this.tehai = []
    this.fuuro = []
    this.agariCard = {}
    this.jifu = {}
    this.chanfu = {}
    this.menzen = true
    this.tsumo = false
    this.riichi = false
    this.wriichi = false
    this.ippatsu = false
    this.chankan = false
    this.haitei = false
    this.hotei = false
    this.linshan = false
    this.tenho = false
    this.chiho = false
  }

  Update() {
    this.menzen = this.isMenzen()
  }

  isMenzen() {
    if (this.fuuro.length === 0) {
      return true
    }
    for (let menzu of this.fuuro) {
      if (menzu.ura === false) {
        return false
      }
    }

    return true
  }
}

export { Context }
