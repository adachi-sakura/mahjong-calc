class Yaku {
  constructor(id, name, fan, kuisagari, isYakuman, checkFunc, requirement) {
    this.id = id
    this.name = name
    this.fan = fan
    this.kuisagari = kuisagari
    this.isYakuman = isYakuman
    this.checkFunc = checkFunc
    this.requirement = requirement
  }

  Preflight(ctx) {
    return this.checkFunc(ctx)
  }

  Check(ctx, comp) {
    if (!this.requirement.Validate(comp)) {
      return false
    }
    if (!this.kuisagari === 0 && !ctx.menzen) {
      return false
    }
    return this.checkFunc(ctx, comp)
  }
}

class YakuMetaRequirement {
  constructor(menzuCnt, duiziCnt) {
    this.menzuCnt = menzuCnt
    this.duiziCnt = duiziCnt
  }

  None() {
    return this.menzuCnt === 0 && this.duiziCnt === 0
  }

  Validate(comp) {
    if (this.None()) {
      return true
    }
    return (
      this.menzuCnt === comp.menzus.length &&
      this.duiziCnt === comp.duizis.length
    )
  }
}

export { Yaku, YakuMetaRequirement }
