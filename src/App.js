import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import * as Firebase from './FirebaseHelper'
import MapComponent from './Map'
import { ListItem, INACTIVE_THRESHOLD } from './ListItem'

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

      if(values !== null) {
        setData(values)
        setTrackedRoutes(Object.keys(values).reverse())
        setLastUpdate(Date.now())
  
        timeout = setTimeout(() => {
          setIsInactive(true)
        }, INACTIVE_THRESHOLD)
      }
    }, 'tracking')
  }, [])

  return (
    <>
      <div className="left__bar">
          <h2>Tracked Routes</h2>
          {!data ?
            <span>Loading...</span> :
            <span>Last udpated {dayjs(lastUpdate).format('HH:mm:ss')}</span>
          }
  
          <div className="list">
            {trackedRoutes.map((route, i) => <ListItem key={i} route={route} routeData={data[route]} activeRoute={activeRoute} setActiveRoute={setActiveRoute} isInactive={isInactive} />)}
          </div>
      </div>
        <MapComponent route={activeRoute ? data[activeRoute] : []} isActive={true} />
    </>
  )
}

export default App