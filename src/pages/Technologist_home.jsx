import { useEffect, useState } from 'react'
import Search from '../Components/Search/Search'
import Dropdown from '../Components/Dropdown/Dropdown.jsx'
import CultureCard from '../Components/CultureCard/CultureCard.jsx'
import '../style/Home_pagescss.css'
import {card} from '../helpers/cardCulture.js'
import { getFilterOptions, greenhouses } from '../helpers/filteringOptions.js'
import GreenhouseCard  from '../Components/GreenhousesCard/GreenhousesCard.jsx'
import { greenhousesDate } from '../helpers/cardGreenhouses.js'
import {cultureImageMap} from '../helpers/cultureImageMap.js'


function getCookie(name) {
  const math = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  if (math) return math[2]  
}

function redirectToLogin () {
   localStorage.setItem('expiredMessage', 'Ваша сессия устарела.')

   window.location.href = '/Login.jsx'
}

export default function Agronomist_home () {
  const [activeTab, setActiveTab] = useState('cultures')
  const [cultureData, setCultureData] = useState([])
  const [greenHouseData, setGreenHouseData] = useState([])

  useEffect(() => {
    const token = getCookie('token') || localStorage.getItem('token')

    if(!token) {
      redirectToLogin()
      return
    }

    fetch('http://localhost:5180/api/cultures', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    .then(async (response) => {
      if (response.status === 401) {
        redirectToLogin()
        return
      }
      if (!response.ok) {
        throw new Error('Ошибка при получении данных')
      }

      const data = await response.json()
      setCultureData(data)
    }) 
    .catch((error) => {
      console.error('Ошибка при получении данных:', error)
    })
    }, [])

    useEffect(() => {
      const tocken = getCookie('token') || localStorage.getItem('token')

      if (!tocken) {
        redirectToLogin()
        return
      }

      fetch('http://localhost:5180/api/greenhouses', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tocken}`
        }
      })

      .then(async(response) => {
        if (response.status === 401) {
          redirectToLogin()
          return
        }
        if (!response.ok) {
          throw new Error('Ошибка при получении данных')
        }

        const data = await response.json()
        setGreenHouseData(data)
      })
      .catch((error) => {
        console.error('Ошибка при получении данных:', error)
      })
    }, [])


    return (
        <div className='main'>
            <div className='change'>
                {activeTab === 'cultures' ? (
                  <>
                  <button className='cultures active_tab' onClick={() => setActiveTab('cultures')}>
                    <span>Культуры</span>
                  </button>

                  <button className='greenhouses' onClick={() => setActiveTab('greenhouses')}>
                    <span>Теплицы</span>
                  </button>
                  </>
                ) : (
                  <>
                  <button className='greenhouses active_tab' onClick={() => setActiveTab('greenhouses')}>
                    <span>Теплицы</span>
                  </button>

                  <button className='cultures' onClick={() =>setActiveTab('cultures')}>
                    <span>Культуры</span>
                  </button>
                  </>
                )}
            </div>
        <div className='conteiner'>
          <div className='panel'>
            <aside className='search-filter'>
                <Search/>
                <Dropdown options={getFilterOptions('culture')} placeholder="Выберите тип культуры"  />    
                <Dropdown options={getFilterOptions('greenhouses')} placeholder="Выберите теплицу"  />
                <button className='search-filter__button search-filter__button_black-bold' type='submit '>Применить фильтрацию</button>
                <button className='search-filter__button search-filter__button_grey' type='submit '>Сбросить фильтрацию</button>
            </aside>
          </div>

          {activeTab === 'cultures' ? (
            <section className='culture-cards'>
            {cultureData.map((card, index) => {
              const image = cultureImageMap[card.name]
                return (
                    <CultureCard key={index} id={card.cultureid} img={image} title={card.name} type={card.type} greenhouses={card.greenhouses}/>
                )})}
          </section>
          ) : (
            <section className='greenhouses-cards'>
              {greenHouseData.map((gh, i) => (
                <GreenhouseCard 
                  key={i}
                  id={gh.id}
                  img={cultureImageMap[gh.culture]}
                  name={gh.name}
                  temperature={gh.temperature}
                  humidity={gh.humidity}
                  light={gh.lighting}
                  lightLevel={gh.lightLevel}
                  status={gh.status}
                  sensorError={gh.sensorError}
                />
              ))}
            </section>
          )}
        </div>
      </div>
    )
}