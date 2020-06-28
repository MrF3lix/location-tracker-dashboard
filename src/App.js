import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import * as Firebase from './FirebaseHelper'
import MapComponent from './Map'

const App = () => {
  const [activeRoute, setActiveRoute] = useState();
  const [trackedRoutes, setTrackedRoutes] = useState([])
  const [data, setData] = useState()

  useEffect(() => {
    Firebase.init();
    Firebase.subscribeToLocationTracking(item => {
      var values = item.val()

      setData(values)
      setTrackedRoutes(Object.keys(values))
      setActiveRoute(Object.keys(values)[0])
    })
  }, [])
  
  return (
    <>
      <div className="top__bar">
        <div className="inner">
          <h1>Location Tracking Dashboard</h1>
          <h2>Tracked Routes</h2>
          {!data &&
            <span>Loading...</span>
          }
          <div className="list">
            {trackedRoutes.map(route => {
              const routeData = data[route]
              if (!routeData || !routeData.latest) return;

              const latestLocation = routeData.latest.location
              const lastUpdate = dayjs(latestLocation.timestamp)

              const isActive = lastUpdate.add(10, 'seconds').isAfter(dayjs())

              return (
                <div className="item" key={route} onClick={() => setActiveRoute(route)}>
                  <strong>
                    {isActive ?
                      <span className="tag tag--active">Active</span> :
                      <span className="tag tag--stopped">Stopped</span>
                    }
                    {lastUpdate.format('HH:mm:ss')} - {route}
                  </strong>
                  <div className="action">
                    <button onClick={() => setActiveRoute(route)}>Select</button>
                    <button onClick={() => Firebase.deleteRoute(route)} disabled>Delete</button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      {
        activeRoute &&
        <MapComponent route={data[activeRoute]} />
      }
    </>
  )
}

export default App