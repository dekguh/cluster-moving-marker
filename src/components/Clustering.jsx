/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'
import Supercluster from 'supercluster'
import L from 'leaflet'
import IconCluster from './IconCluster'
import IconMarker from './IconMarker'
import MovingMarker from './MovingMarker'

const updateMapBoundsAndZoom = (mapContext, setBounds, setZoom) => {
  if (mapContext) {
    const bounds = mapContext.getBounds()
      
    setBounds([
      bounds.getSouthWest().lng,
      bounds.getSouthWest().lat,
      bounds.getNorthEast().lng,
      bounds.getNorthEast().lat
    ])
      
    setZoom(mapContext.getZoom())
  }
}

const Clustering = ({objectList, mapContext }) => {
  // REFS
  const geojsonRef = React.useRef()
  const superclusterRef = React.useRef()

  // STATES
  const [mapBounds, setMapBounds] = React.useState()
  const [mapZoom, setMapZoom] = React.useState()

  const createClusterIcon = (feature, latlong) => {
    if(!feature.properties.cluster && !feature.markerData.moving) {
      // OBJECT MARKER & NOT ON MOVING
      return MovingMarker(feature, latlong, mapContext)
    } else {
      // CLUSTER MARKER
      return L.marker(latlong, {
        icon: IconCluster()
      })
    }
  }

  const updateCluster = () => {
    // CREATE GEOJSON & ADD TO MAP
    if(!geojsonRef.current) geojsonRef.current = L.geoJSON(null, {
      pointToLayer: createClusterIcon
    }).addTo(mapContext)

    // CLEAR PREV LAYERS
    geojsonRef.current.clearLayers()

    // RESTRUCTURE TO GEOJSON
    const pointList = objectList.map(item => ({
      type: 'Feature',
      properties: {
        cluster: false,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          parseFloat(item.state?.lng),
          parseFloat(item.state?.lat),
        ],
      },
      markerData: item,
    }))

    // SUPERCLUSTER
    superclusterRef.current = new Supercluster({
      radius: 60,
      extent: 256,
      maxZoom: 20,
    })

    // ADD ONLY NOT MOVING MARKER
    superclusterRef.current.load(pointList.filter(item => item.markerData.moving === false))

    // GET MARKERS INSIDE BOUNDS (ENTIRE SCREEN)
    const newClusterList = superclusterRef.current.getClusters(mapBounds, mapZoom)

    // ADD DATA CLUSTER LIST TO GEOJSON
    geojsonRef.current.addData(newClusterList)

    // DO MOVING MARKERS
    pointList.map(item => {
      if(item.markerData.moving) {
        MovingMarker(item, item.markerData.state, mapContext)
      }
    })
  }

  // UPDATE ZOOM & BOUNDS
  React.useEffect(() => {
    if(mapContext) {
      if(!mapBounds) {
        updateMapBoundsAndZoom(mapContext, setMapBounds, setMapZoom)
      }
  
      mapContext.on('zoom drag', () => {
        updateMapBoundsAndZoom(mapContext, setMapBounds, setMapZoom)
      })
    }
  }, [mapContext])

  // UPDATE CLUSTER
  React.useEffect(() => {
    if(mapBounds && mapZoom && objectList.length) {
      updateCluster()
    }
  }, [mapBounds, mapZoom, objectList])

  return (
    <div>Clustering</div>
  )
}

export default Clustering