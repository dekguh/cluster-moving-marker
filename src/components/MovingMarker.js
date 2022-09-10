/* eslint-disable no-extra-boolean-cast */
/* eslint-disable no-unused-vars */
import IconMarker from './IconMarker'
import L from 'leaflet'
import 'leaflet.motion/dist/leaflet.motion'

/**
 * temp trail tracker
 * structure array are
 * [
 *   { trackerId: number, layerPolyline: [classes, classes, ...], previousState: { lat, lng } }
 * ]
 */
let tempTrailTracker = []

const addDataToTemp = (trackerId, nextState, classPolyline) => {
  const findTracker = tempTrailTracker.find(item => item.trackerId === trackerId)
  
  // CREATE ITEM WHEN NOT HAVE
  if(!Boolean(findTracker)) {
    tempTrailTracker.push({
      trackerId,
      layerPolyline: [],
      previousState: nextState
    })
  } else { // UPDATE PREV & ADD POLYLINE CLASS
    const getIndex = tempTrailTracker.findIndex(item => item.trackerId === trackerId)
    tempTrailTracker[getIndex].previousState = nextState
    tempTrailTracker[getIndex].layerPolyline.push(classPolyline)
  }
}

const getDataTempTrail = (trackerId) => {
  return tempTrailTracker.find(item => item.trackerId === trackerId)
}

export default (feature, latlong, map) => {
  // CREATE MARKER
  const instanceMarker = L.marker(latlong, {
    icon: IconMarker(feature.markerData)
  })

  // CREATE POLYLINE
  let instancePolyline = null
  const detailTempTracker = getDataTempTrail(feature.markerData.id)
  if(Boolean(detailTempTracker) && feature.markerData.moving) {
    if(
      detailTempTracker.previousState.lat !== latlong.lat
      && detailTempTracker.previousState.lng !== latlong.lng
    ) {
      instancePolyline = instancePolyline = new L.motion.polyline(
        [
          [detailTempTracker.previousState.lat, detailTempTracker.previousState.lng],
          [latlong.lat, latlong.lng]
        ],
        null,
        {
          auto: true,
          duration: 5000,
        },
        {
          showMarker: true,
          icon: IconMarker(feature.markerData),
          removeOnEnd: true
        }
      )

      map.addLayer(instancePolyline)
      addDataToTemp(feature.markerData.id, latlong, instancePolyline)
    }
  } else {
    addDataToTemp(feature.markerData.id, latlong)
  }

  if(!feature.markerData.moving) return instanceMarker
  return null
}