import React, { useState, useEffect } from 'react'
import ReactMapGL, { Marker } from 'react-map-gl';
import { LocationPin } from './Pin';
import PolylineOverlay from './PolylineOverlay';

const MapComponent = ({ route, isActive }) => {
    const [viewport, setViewport] = useState({
        width: '400px',
        height: '400px',
        latitude: 52.36672,
        longitude: 4.9254,
        zoom: 11
    });

    useEffect(() => {
        if (!route || !route.latest) return

        const latestLocation = route.latest.location.coords
        setViewport({ ...viewport, latitude: latestLocation.latitude, longitude: latestLocation.longitude })
    }, [route])

    useEffect(() => {
        updateSize()
        window.addEventListener('resize', updateSize)
        return () => window.removeEventListener('resize', updateSize)
    }, [])

    const updateSize = () => {
        setViewport({ ...viewport, height:window.innerWidth > 750 ? window.innerHeight : window.innerHeight - 200, width: window.innerWidth > 750 ? window.innerWidth - 350 : window.innerWidth })
    }


    const latestLocation = route?.latest?.location?.coords

    return (
        <div>
            <ReactMapGL
                {...viewport}
                onViewportChange={nextViewport => setViewport(nextViewport)}
                mapStyle="mapbox://styles/mapbox/streets-v11"
                mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                transitionDuration={100}
            >
                <PolylineOverlay points={getPointsFromRoute(route)} />

                {latestLocation &&
                    <Marker key={latestLocation.timestamp} latitude={latestLocation.latitude} longitude={latestLocation.longitude}>
                        <LocationPin direction={latestLocation.heading} isLive={isActive} />
                    </Marker>
                }

            </ReactMapGL>
        </div>
    )
}

const getPointsFromRoute = route => {
    if (!route) return [];
    return Object.keys(route).map(pointKey => {
        const point = route[pointKey]
        if(!point && !point.location) return []
        return [
            point.location.coords.longitude,
            point.location.coords.latitude
        ]
    })
}


export default MapComponent