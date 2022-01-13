import { Base, px } from "/ui/Base.js"

export async function main(ns) {

}

export class StatusBar extends Base {
    static CLASS = "StatusBar"

    constructor(doc, { divId, container, clickHandler, weight = 50 } = {}) {
        super(doc.createElement('div'))
        this.divId = divId
        this.weight = weight

        this.style = {
            position: 'relative',
            height: '1.3em',
            borderTop: '1px solid #111',
            borderBottom: '1px solid #111',
            marginBottom: '-1px',
        }

        if (divId) { this.e.base.id = divId }
        if (container) { this.mountTo(container) }
        if (clickHandler) { this.addClickHandler(clickHandler) }
    }

    mountTo(container) {
        if (this.divId) {
            // Using this instead of getElementById to (try to) limit the search scope (though
            //  element IDs should be unique regardless)
            let existing = container.e.base.querySelector(`#${this.divId}`)
            if (existing) { existing.remove() }
        }
        container.addChild(this)
        return this
    }

    addClickHandler(callback) {
        this.e.base.addEventListener("click", callback)
    }

    get weight() { return this.e.base.dataset.weight || 50 }

    set weight(newWeight) { this.e.base.dataset.weight = newWeight }

    ensureContainer(doc, container) {
        // Check to see whether this element is still being rendered (e.g. if the script that
        //  "owns" the container stopped/restarted).  If it's not, try to find a new container and
        //  add this bar to the new container.  If this StatusBar is being rendered, then this does
        //  nothing.  Note: To call this, you need to have set a divId.
        if (!this.divId) { throw new Error("To call ensureContainer(), a divId must be set in the StatusBar constructor.") }

        if (doc.getElementById(this.divId) === null) {
            let containerValid = container.updateReference(doc)
            if (containerValid) {
                container.addChild(this)
            }
        }
        return container
    }

    remove() {
        this.e.base.remove()
    }
}

export class StatusBarText extends StatusBar {
    static CLASS = "StatusBarText"

    constructor(doc, { labelText, ...args } = {}) {
        super(doc, { ...args })
        this.e.llabel = this.e.base.appendChild(doc.createElement('div'))
        this.e.rlabel = this.e.base.appendChild(doc.createElement('div'))


        const labelStyles = {
            position: 'absolute',
            top: px(0),
            width: '100%',
        }

        Object.assign(this.e.llabel.style, {
            ...labelStyles,
            textAlign: 'left',
            left: '0.25em',
            color: '#DDD',
        })
        Object.assign(this.e.rlabel.style, {
            ...labelStyles,
            textAlign: 'right',
            color: '#AAA',
            right: '0.25em',
        })

        this.label = labelText
    }

    set llabel(labelText) {
        this.e.llabel.innerHTML = labelText
    }

    set rlabel(labelText) {
        this.e.rlabel.innerHTML = labelText
    }

    set label(labelText) {
        this.llabel = labelText
    }
}

export class StatusBarProgress extends StatusBarText {
    static CLASS = "StatusBarProgress"

    constructor(doc, { labelText, progressFraction = 0.5, barColor = '#334f24', ...args } = {}) {
        super(doc, { ...args })
        this.e.prog = this.e.base.insertBefore(doc.createElement('div'), this.e.base.firstChild)

        Object.assign(this.e.prog.style, {
            width: '100%',
            height: '1.3em',
            backgroundColor: barColor,
            transition: '500ms linear',
        })

        this.rlabel = labelText
        this.progress = progressFraction
    }

    set progress(progressFraction) {
        this.e.prog.style.width = `${Math.round(100 * progressFraction)}%`
        this.e.llabel.innerHTML = `${(100 * progressFraction).toFixed(2)}%`
    }

    set label(labelText) {
        // Unlike its parent, StatusBarProgress's "default" label is the rlabel
        this.rlabel = labelText
    }
}




