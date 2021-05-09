import React from 'react'
import dayjs from 'dayjs'
import * as Firebase from './FirebaseHelper'

export const INACTIVE_THRESHOLD = 10000

export const ListItem = ({ route, routeData, activeRoute, setActiveRoute, isInactive }) => {
    if (!routeData || !routeData.latest) return <React.Fragment />;

    const latestLocation = routeData.latest.location
    const lastUpdate = dayjs(latestLocation.timestamp)

    const today = dayjs();
    if (lastUpdate.isBefore(today.add('-1', 'day'))) {
      return <React.Fragment key={route} />
    }

    const isActive = lastUpdate.add(INACTIVE_THRESHOLD, 'miliseconds').isAfter(dayjs())

    return (
        <div className={`item ${activeRoute === route ? 'item--active' : 'item--inactive'}`} key={route} onClick={() => setActiveRoute(route)}>
            <div>
                {isActive && !isInactive ?
                    <span className="tag tag--active">Active</span> :
                    <span className="tag tag--stopped">Stopped</span>
                }
            </div>
            <span>
                {lastUpdate.format('DD/MM/YY - HH:mm:ss')} - {route}
            </span>
            <div className="action">
                <button onClick={() => setActiveRoute(route)}>Select</button>
                <button onClick={() => Firebase.deleteRoute(route)} disabled={false}>Delete</button>
            </div>
        </div>
    )
}