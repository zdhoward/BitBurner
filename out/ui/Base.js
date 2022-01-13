export async function main(ns) {

}

/* eslint-disable lines-between-class-members */
export class Base {
    constructor(element) {
        this._e = {
            base: element
        }
        this.e.base.classList.add(...this.collectClasses())
    }

    // "Protect" elements object
    get e() { return this._e }
    set e(arg) { throw new Error("Can't modify attribute: e") }

    get style() {
        return this.e.base.style
    }

    set style(styles) {
        Object.assign(this.e.base.style, styles)
    }

    *collectClasses() {
        let obj = Object.getPrototypeOf(this)
        while (obj) {
            if (obj.constructor.CLASS) { yield obj.constructor.CLASS }
            obj = Object.getPrototypeOf(obj)
        }
    }
}

export const px = (x) => `${x}px`

export const globalConfig = (doc) => {
    doc.StatusBarConfig ||= {}
    return doc.StatusBarConfig
}

export const setGlobal = (doc, key, newValue) => {
    const config = globalConfig(doc)
    const oldValue = config[key]
    config[key] = newValue
    return oldValue
}
export const getGlobal = (doc, key) => {
    const config = globalConfig(doc)
    return config[key]
}
