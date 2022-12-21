import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { ConnectedSiteItem } from '~/components/Item'
import { db, IConnectedSite } from '~/db'
import { useClosablePage } from '~/layouts/ClosablePage'
import rootStore from '~/store'
import connectableSites from '~config/connectableSites.json'
import InfoIcon from '~icons/hoogii/info.jsx'

const ConnectedSites = () => {
    const { t } = useTranslation()
    useClosablePage(t('setting-connected_sites'))
    const {
        walletStore: { connectedSites },
    } = rootStore
    const availableSites = useMemo(
        () =>
            connectableSites.filter(
                (item) =>
                    !connectedSites.some(
                        (connectedSite) => connectedSite.url === item.url
                    )
            ),
        []
    )

    const connectSite = async (site: IConnectedSite) => {
        await db.connectedSites.add(site)
    }

    const disconnectSite = async (site: IConnectedSite) => {
        site.id && (await db.connectedSites.delete(site.id))
    }

    return (
        <div className="flex flex-col gap-5 overflow-auto">
            <div className="flex flex-col gap-2">
                {connectedSites.map((site) => (
                    <ConnectedSiteItem
                        key={site.name}
                        name={site.name}
                        iconUrl={site.iconUrl}
                        href={site.url}
                        target="_blank"
                        rel="noreferrer"
                        action={() => disconnectSite(site)}
                    />
                ))}
            </div>
            <div className="gap-2 text-body1 text-primary-100 flex-col-center">
                {t('setting-connected_sites-description')}
                <div
                    className="tooltip after:w-[260px] cursor-pointer"
                    data-tip={t('tooltip-connected_sites')}
                >
                    <InfoIcon className="w-3 h-3 text-active" />
                </div>
            </div>
            <div className="flex flex-col gap-2">
                {availableSites.map((site) => (
                    <ConnectedSiteItem
                        key={site.name}
                        name={site.name}
                        iconUrl={site.iconUrl}
                        href={site.url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => connectSite(site)}
                        disabled
                    />
                ))}
            </div>
        </div>
    )
}

export default observer(ConnectedSites)