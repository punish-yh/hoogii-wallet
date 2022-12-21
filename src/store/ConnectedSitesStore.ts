import { liveQuery } from 'dexie'
import { makeAutoObservable, onBecomeUnobserved } from 'mobx'

import { db, IConnectedSite } from '~/db'

class ConnectedSitesStore {
    connectedSites: IConnectedSite[] = []

    unsubscribeConnectedSites = () => {}
    subscribeConnectedSites = () => {
        const observable = liveQuery(() => db.connectedSites.toArray())
        const subscription = observable.subscribe({
            next: (result) => (this.connectedSites = result),
        })
        this.unsubscribeConnectedSites = () => subscription.unsubscribe()
    }

    constructor() {
        makeAutoObservable(this)
        this.subscribeConnectedSites()
        onBecomeUnobserved(
            this,
            'connectedSites',
            this.unsubscribeConnectedSites
        )
    }

    isConnectedSite = (origin) => {
        return this.connectedSites.some((site) => site.url === origin)
    }
}

const store = new ConnectedSitesStore()

export default store