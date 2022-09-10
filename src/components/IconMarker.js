import React from 'react'
import L from 'leaflet'
import * as ReactDOMServer from 'react-dom/server'

// ICONS
import { AiFillCar } from 'react-icons/ai'
import { FaMotorcycle } from 'react-icons/fa'

export default (markerData) => {
  const getIconType = (type) => {
    if(type === 'mobil') return <AiFillCar />
    else if(type === 'motor') return <FaMotorcycle />
  }

  return L.divIcon({
    className: 'icon--marker-custom',
    html: ReactDOMServer.renderToString(
      <div
        className='flex items-center transform -translate-x-2/4 -translate-y-2/4'
        style={{ width: 'fit-content' }}
      >
        <div
          className='text-white rounded-full h-[30px] w-[30px] mr-1 relative'
          style={{
            backgroundColor: markerData.color
          }}
        >
          <i className='absolute top-2/4 left-2/4 transform -translate-x-2/4 -translate-y-2/4 text-lg'>
            {getIconType(markerData.type)}
          </i>
        </div>

        <div
          className='flex text-white py-[4px] px-[12px] font-semibold'
          style={{
            whiteSpace: 'nowrap',
            backgroundColor: markerData.color
          }}>
          {markerData.label}
        </div>
      </div>
    )
  })
}