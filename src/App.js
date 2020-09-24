import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import * as Firebase from './FirebaseHelper'
import MapComponent from './Map'

const INACTIVE_THRESHOLD = 10000
let timeout = null

const App = () => {
  const [isInactive, setIsInactive] = useState(true)
  const [lastUpdate, setLastUpdate] = useState()

  const [activeRoute, setActiveRoute] = useState()
  const [trackedRoutes, setTrackedRoutes] = useState([])
  const [data, setData] = useState()

  useEffect(() => {
    Firebase.init()
    Firebase.subscribeToLocationTracking(item => {
      setIsInactive(false)
      clearTimeout(timeout)

      var values = item.val()

      setData(values)
      setTrackedRoutes(Object.keys(values))
      // setActiveRoute(Object.keys(values)[0])
      setLastUpdate(Date.now())

      timeout = setTimeout(() => {
        setIsInactive(true)
      }, INACTIVE_THRESHOLD)
    
    })
  }, [])

  return (
    <>
      <div className="left__bar">
        <div className="inner">
          {/* <h1>Location Tracking Dashboard</h1> */}
          <h2>Tracked Routes</h2>
          {!data ?
            <span>Loading...</span> :
            <span>Last udpated {dayjs(lastUpdate).format('HH:mm:ss')}</span>
          }
  
          <div className="list">
            {trackedRoutes.map(route => {
              const routeData = data[route]
              if (!routeData || !routeData.latest) return;

              const latestLocation = routeData.latest.location
              const lastUpdate = dayjs(latestLocation.timestamp)

              const today = dayjs(new Date());
              if(lastUpdate.isBefore(today.add('-1', 'day'))) {
                return <React.Fragment />
              }

              const isActive = lastUpdate.add(INACTIVE_THRESHOLD, 'miliseconds').isAfter(dayjs())

              return (
                <div className="item" key={route} onClick={() => setActiveRoute(route)}>
                  <strong>
                    {isActive && !isInactive ?
                      <span className="tag tag--active">Active</span> :
                      <span className="tag tag--stopped">Stopped</span>
                    }
                    {lastUpdate.format('DD/MM/YY - HH:mm:ss')} - {route}
                  </strong>
                  <div className="action">
                    <button onClick={() => setActiveRoute(route)}>Select</button>
                    <button onClick={() => Firebase.deleteRoute(route)} disabled={false}>Delete</button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
        <MapComponent route={(activeRoute && data) ? data[activeRoute] : []} />
    </>
  )
}

export default App