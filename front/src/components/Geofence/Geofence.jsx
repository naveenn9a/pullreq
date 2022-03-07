import React, { useEffect } from 'react';
import axios from 'axios';
import { API } from './../../config/config';
import ArrowIcon from './../../assets/arrow.svg'
import './Geofence.scss';
import _ from 'lodash'
import { useState } from 'react';

function Geofence({ handleModalOpen, geofenceOpen }) {
  const [geofenceData, setGeofenceData] = useState({})
  const [extended, setExtended] = useState([])
  const [checkedData, setCheckedData] = useState({})

  useEffect(async () => {
    let data = await axios.get(`${API}/geofence`)
    let panelData = JSON.parse(data.data);
    let obj = {};
    let obj2 = {};

    panelData.features.map(o => {
      let trackPrefix = o.properties['TrackPrefix']
      if (!obj[trackPrefix])
        obj[trackPrefix] = {};

      if (!obj[trackPrefix][o.properties.Type])
        obj[trackPrefix][o.properties.Type] = [];

      obj[trackPrefix][o.properties.Type].push(o.properties);
    })

    Object.keys(obj).map(key => {
      if (!obj2[key])
        obj2[key] = [];

      Object.keys(obj[key]).map(type => {
        obj2[key] = [...obj2[key], ...obj[key][type]];
      })
    })

    setGeofenceData(obj2);
  }, [])

  const toggleExtend = (trackKey) => {
    let temp = [...extended]

    if (temp.includes(trackKey)) {
      temp = temp.filter(o => o != trackKey);
    } else {
      temp.push(trackKey)
    }

    setExtended(temp)
  }

  const handleChecking = (trackKey, subKey) => {
    let temp = { ...checkedData }

    if (temp[trackKey] && temp[trackKey].includes(subKey)) {
      temp[trackKey] = temp[trackKey].filter(o => o != subKey);
    } else {
      if (!temp[trackKey])
        temp[trackKey] = []
      temp[trackKey].push(subKey)
    }

    setCheckedData(temp)
    return;
  }

  const selectAllCheck = (val, trackKey) => {
    let temp = { ...checkedData }

    if (trackKey) {
      if (temp[trackKey]) {
        delete temp[trackKey];
      } else {
        temp[trackKey] = geofenceData[trackKey].map(e => e.UniqueName)
          console.log(geofenceData[trackKey].map(e => e.UniqueName))
      }
      setCheckedData(temp)
    }
  }

  return (
    <div className="geofence">
      <span onClick={e => handleModalOpen(false)} className="close-modal">x</span>
      <div className="geofence-main">
        <h4>Geo-Fence Display</h4>
        <ul className='outer-ul-gf'>
          {Object.keys(geofenceData).map(trackKey => {
            let length = checkedData[trackKey] ? Object.keys(checkedData[trackKey]).length > 0 : false
            return <li key={trackKey}>
              <input onChange={e => selectAllCheck(e.target.value, trackKey)} type="checkbox" name="" checked={length} id="" /><span className="bold">Track: {trackKey}</span><span className="arrow"><img className={`${extended.includes(trackKey) ? 'rotate' : ''}`} src={ArrowIcon} onClick={e => { e.stopPropagation(); toggleExtend(trackKey); }} alt="" /></span>

              <ul onClick={e => e.stopPropagation()} className={`${extended.includes(trackKey) ? 'shown' : 'hidden'} inner-ul-gf`}>
                {geofenceData[trackKey].map(subItem => {
                  return <li title={subItem.UniqueName} key={subItem.UniqueName}><input onChange={e => {
                    handleChecking(trackKey, subItem['UniqueName'])
                  }} type="checkbox" name="" checked={checkedData[trackKey] && checkedData[trackKey].includes(subItem.UniqueName)} id="" />{subItem.Type}: <span className="bold">{subItem['Track/Hällered subpart']}</span>{subItem.Subtype ? `(${subItem.Subtype})` : ''}</li>
                })}
              </ul>
            </li>
          })}
        </ul>
      </div>
      <div className="menu-info-button">
      </div>
    </div>
  );
}

export default Geofence;
