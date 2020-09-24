import React, { useState, useEffect } from 'react'
import ReactMapGL, { Marker } from 'react-map-gl';
import PolylineOverlay from './PolylineOverlay';

const MapComponent = ({ route }) => {
    const [viewport, setViewport] = useState({
        width: '400px',
        height: '400px',
        latitude: 47.460139565049076,
        longitude: 9.041964910169368,
        zoom: 12
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
        setViewport({ ...viewport, height: window.innerHeight, width: window.innerWidth - 350 })
    }


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