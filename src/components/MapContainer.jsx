/* eslint-disable no-extra-boolean-cast */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react'

import { MapContainer as MapLeaflet, TileLayer } from 'react-leaflet'
import dataStates from '../utils/dataStates'
import dataTracker from '../utils/dataTracker'
import Clustering from './Clustering'

const MapContainer = () => {
  // STATES
  const [mapContext, setMapContext] = useState()
  const [objectList, setObjectList] = useState(dataTracker)
  const [currentIdx, setCurrentIdx] = useState(0)

  const integrateTrackerStates = (tracker, states) => {
    const update = tracker.map(itemTracker => {
      const findStates = states.find(itemState => itemState.trackerId === itemTracker.id)

      if(Boolean(findStates)) return {
        ...itemTracker,
        state: findStates.state,
        moving: findStates.moving,
      }
      else return { ...itemTracker, moving: false }
    })

    return update
  }

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('called every 5 secs')
      setObjectList(integrateTrackerStates(objectList, dataStates[currentIdx]))
      setCurrentIdx(current => current + 1)
    }, 5000)

    return () => clearInterval(interval)
  }, [objectList])

  return (
    <MapLeaflet
      center={[-8.795519, 115.215301]}
      zoom={13}
      className='h-[100vh] w-full'
      whenReady={(map) => setMapContext(map.target)}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Clustering objectList={objectList} mapContext={mapContext} />
    </MapLeaflet>
  )
}

export default MapContainer