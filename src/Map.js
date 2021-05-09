import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react'
import ReactMapGL, { Marker } from 'react-map-gl';
import { LocationPin } from './Pin';
import PolylineOverlay from './PolylineOverlay';

const simplify = require('simplify-geojson')

const MIN_WALKING_SPEED = 0.25 // in meter/second
const MIN_ACCURACY = 50 // in meter

const MIN_SIMPLIFICATION_RATE = 0.0001
const MAX_SIMPLIFICATION_RATE = 0.001

const MapComponent = ({ route, isActive }) => {
    const [viewport, setViewport] = useState({
        width: '400px',
        height: '400px',
        latitude: 52.36672,
        longitude: 4.9254,
        zoom: 11
    });

    const [simpleRoute, setSimpleRoute] = useState()

    useEffect(() => {
        if(!route) return

        let simplificationRate = MIN_SIMPLIFICATION_RATE

        const duration = getDuration(route)
        if(duration > 120) {
            simplificationRate = MAX_SIMPLIFICATION_RATE
        } else if (duration > 60) {
            simplificationRate = 0.0005
        } else if (duration > 20) {
            simplificationRate = 0.0001
        }
        
        const points = simplifyPoints(getPointsFromRoute(route), MIN_SIMPLIFICATION_RATE)
        setSimpleRoute(points)
    }, [route])

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

    const getDuration = route => {
        if(route == null || route.length == 0) return -1

        const locations = Object.keys(route)
        const latestLocation = route[locations[0]]
        const firstLocation = route[locations[1]]

        const diff = dayjs(latestLocation.location.timestamp).diff(firstLocation.location.timestamp, 'm')

        return diff
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
                <PolylineOverlay points={simpleRoute} />

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
    if(Object.keys(route).length === 0) return [];

    console.log('---')
    console.log('Tracked locations: ', Object.keys(route).length)
    const points = Object.keys(route).filter(pointKey => getMovingLocations(route, pointKey))
    console.log('Moving locations: ', points.length)

    return points.map(pointKey => {
        const point = route[pointKey]
        if(!point && !point.location) return []
        return [
            point.location.coords.longitude,
            point.location.coords.latitude
        ]
    })
}

const getMovingLocations = (route, pointKey) => {
    const point = route[pointKey]
    if(!point && !point.location) return false

    const location = point.location

    if(location.coords?.speed === null || location.coords?.accuracy === 0) return false

    if(location.coords.speed > 0.5 && location.coords.accuracy < 50) return true
    return false
}

const simplifyPoints = (points, simplificationRate) => {
    if(points.length === 0) {
        return points
    }
    const simplified = simplify(
        {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "type": "LineString",
                        "coordinates": points
                    }
                }
            ]
        },
        simplificationRate
    )

    const newPoints = simplified.features[0].geometry.coordinates
    console.log(`Simplified locations: `, newPoints.length)

    return newPoints
}


export default MapComponent