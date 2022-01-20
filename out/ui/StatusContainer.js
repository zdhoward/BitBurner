import { Base, globalConfig, px } from "/ui/Base.js"

export async function main(ns) {

}

const CONTAINER_MOUNTS = {
    drawer: {
        point: (doc) => doc.querySelector('.MuiDrawer-root').firstChild,
        mount: (doc, div) => doc.querySelector('.MuiDrawer-root').firstChild.appendChild(div)
    },
    stats: {
        // Ugh, nothing to see here...
        // Currently, the path is:
        // #root > div > div.jss5.MuiPaper-root.MuiPaper-elevation.MuiPaper-elevation1.css-129grii > div > div > div > table > tbody > tr:nth-child(14)
        // But we strip out the minified classes in hopes to minimize the chance that updates will
        //  this unnecessarily.  They still very well might.  If only BitBurner used more IDs...
        point: (doc) => doc.querySelector("#root > div > div.MuiPaper-root.MuiPaper-elevation.MuiPaper-elevation1 > div > div > div > table"),
        mount: (doc, div) => {
            // The stats pane is a 2 column wide table, so we clone the charisma row and insert
            //  the clone after it.  Inside the row we create a td node spanning both columns and
            //  stick the container div inside that.
            let charismaRow = doc.querySelector("#root > div > div.MuiPaper-root.MuiPaper-elevation.MuiPaper-elevation1 > div > div > div > table > tbody > tr:nth-child(15)")
            //let charismaRow = doc.getElementById('overview-extra-hook-0').parentNode.parentNode;
            let clonedRow = charismaRow.cloneNode()
            let th = doc.createElement('td')
            th.colSpan = "2"
            th.appendChild(div)
            clonedRow.appendChild(th)
            charismaRow.after(clonedRow)
        }
    }
}

export class StatusContainer extends Base {
    static _ID = "StatusContainer"

    static get ID() { return this._ID }

    constructor(doc, options = {}) {
        super(StatusContainer._select(doc, options) || StatusContainer._create(doc, options))
        this.location = options.location || 'drawer'
        this.style.width = '12em'
    }

    static _select(doc) {
        return doc.getElementById(this.ID)
    }

    static _create(doc, { location = 'drawer' } = {}) {
        this.location = location

        let div = doc.createElement('div')
        div.id = this.ID

        Object.assign(div.style, {
            backgroundColor: '#252525',
            color: '#DDD',
            fontFamily: 'Consolas',
            left: px(200),
            top: px(2000),
            zIndex: '2000',
        })

        let mount = CONTAINER_MOUNTS[location]
        if (mount.point(doc) !== null) {
            mount.mount(doc, div)
        } else {
            console.debug("mount.point() returned null")
        }

        return div
    }

    updateReference(doc) {
        // This method can be used by scripts to get a reference to the current StatusContainer
        this.e.base = doc.getElementById(StatusContainer.ID)
        return (this.e.base !== null)
    }

    addChild(thingExtendingBase) {
        // Assumes the current children are already properly sorted.  This method will insert
        //  element before the first node it finds with a higher weight (i.e. nodes with equal
        //  weight will be in insertion order).  If no such child is found, the element is added as
        //  the last child.  Any child without a weight set will implicitly have a weight of 50.
        const parseIntSafe = (x, ifnan = 50) => (isNaN(parseInt(x)) ? ifnan : parseInt(x))
        let children = [...this.e.base.children]
        let referenceNode = null
        children.some(child => {
            if (parseIntSafe(child.dataset.weight) > parseIntSafe(thingExtendingBase.weight)) {
                referenceNode = child
                return true
            }
        })
        // parentNode.insertBefore(newNode, referenceNode) inserts newNode as a child of parentNode
        //  immediately before the position of referenceNode.  If referenceNode is null, newNode is
        //  appended at the end of parentNode's children (i.e. parentNode.appendChild(newNode))
        this.e.base.insertBefore(thingExtendingBase.e.base, referenceNode)
    }

    installObserver(doc) {
        const DEBUG = false
        // Sometimes react will destroy the container's parent -- and with it, the container (e.g.
        //  when focusing on a job the left-hand-side drawer will be destroyed).
        const config = globalConfig(doc)

        // Disconnect any existing observers
        config.containerObserver && config.containerObserver.disconnect()

        let inPlace = true
        config.containerObserver = new MutationObserver((mutationList, observer) => {
            if (inPlace === true) {
                for (let mutationEvent of mutationList) {
                    // Check MutationEvent.removedNodes for our StatusContainer
                    for (let removedNode of [...mutationEvent.removedNodes]) {
                        // Some Nodes might not have querySelector method (e.g. TextNodes)
                        if (!removedNode.querySelector) { continue }
                        let caughtContainer = removedNode.querySelector(`#${StatusContainer.ID}`)
                        if (caughtContainer !== null) {
                            if (DEBUG) { console.log("Caught", caughtContainer) }
                            // Store the node somewhere so it's not garbage collected
                            caughtContainer.style.visibility = 'hidden'
                            doc.querySelector('#root').appendChild(caughtContainer)
                            inPlace = false
                            return
                        }
                    }
                }
            } else {
                // We've caught a container, watch for changes that would allow us to reinsert it
                let mount = CONTAINER_MOUNTS[this.location]
                let point = null
                // mount.point() will throw every time a DOM change occurs until React restores
                //  our "parent".  We can safely ignore these errors.
                try {
                    point = mount.point(doc)
                } catch (error) { }
                if (point) {
                    let caughtContainer = doc.getElementById(StatusContainer.ID)
                    if (DEBUG) { console.log("Remounting", caughtContainer) }
                    caughtContainer.style.visibility = 'visible'
                    mount.mount(doc, caughtContainer)
                    inPlace = true
                }
            }
        })

        // I'm not thrilled about observing the entire DOM tree for this...
        let containerAncestor = doc.querySelector('#root')
        config.containerObserver.observe(containerAncestor, { childList: true, subtree: true })
    }

    destroy() {
        if (this.location === 'stats') {
            // Remove our cloned tr node (and with it, the container)
            this.e.base.parentElement.parentElement.remove()
        } else {
            // Remove container node
            this.e.base.remove()
        }

    }
}
