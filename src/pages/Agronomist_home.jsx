import Search from '../Components/Search/Search'
import Dropdown from '../Components/Dropdown/Dropdown.jsx'
import CultureCard from '../Components/CultureCard/CultureCard.jsx'
import '../style/Home_pagescss.css'
import {card} from '../helpers/cardCulture.js'
import { getFilterOptions } from '../helpers/filteringOptions.js'
import { useState } from 'react'
import Input from '../Components/Input/InputSymbol/InputSymbol.jsx'
import ButtonOverlay from '../Components/Button/ButtonOverlay/ButtonOverlay.jsx'
import { cultureImageMap } from '../helpers/cultureImageMap.js'
import { useEffect } from 'react'


function getCookie(name) {
  const math = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  if (math) return math[2]  
}

function redirectToLogin () {
   localStorage.setItem('expiredMessage', 'Ваша сессия устарела.')

   window.location.href = '/Login.jsx'
}

export default function Agronomist_home () {
  const [isModelOpen, setIsModelOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [cultureData, setCultureData] = useState([])
  const [newCulture, setNewCulture] = useState({
    name: '',
    type: '',
    optimalConditions: {
      temp: '',
      humidity: '',
      lightLevel: ''
    }
  })

  function handleChange(e) {
    const { name, value } = e.target

    // Для полей optimalConditions — нужно обновлять вложенный объект
    if (name === 'temp' || name === 'humidity' || name === 'lightLevel') {
      setNewCulture(prev => ({
        ...prev,
        optimalConditions: {
          ...prev.optimalConditions,
          [name]: value
        }
      }))
    } else {
      setNewCulture(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const closeModelDelete = () => {
    setIsDeleteModalOpen(false)
    setSelectedCultureId(null)
  }

  const openModal = () => setIsModelOpen(true)
  const closeModel = () =>  setIsModelOpen(false)

  useEffect(() => {
    const token = getCookie('token') || localStorage.getItem('token')

      if (!token) {
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

    async function handleAddCulture() {
    const token = getCookie('token') || localStorage.getItem('token')
    if (!token) {
      redirectToLogin()
      return
    }

    // Проверяй или конвертируй данные при необходимости (например, из строки в число)
    const payload = {
      name: newCulture.name,
      type: newCulture.type,
      optimalConditions: {
        temp: Number(newCulture.optimalConditions.temp),
        humidity: Number(newCulture.optimalConditions.humidity),
        lightLevel: Number(newCulture.optimalConditions.lightLevel)
      }
    }

    try {
      const response = await fetch('http://localhost:5180/api/cultures', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      if (response.status === 401) {
        redirectToLogin()
        return
      }

      if (!response.ok) {
        throw new Error('Ошибка при добавлении культуры')
      }

      const createdCulture = await response.json()
      setCultureData(prev => [...prev, createdCulture])
      setIsModelOpen(false)  
      setNewCulture({
        name: '',
        type: '',
        optimalConditions: { temp: '', humidity: '', lightLevel: '' }
      })

    } catch (error) {
      alert(error.message)
    }
  }



    return (
        <div className='main'>
          <div className='change'>
            <h1>Культуры</h1>
          </div>
        <div className='conteiner'>
          <div className='panel'>
            <button className='add-culture-button button-add'type='button' onClick={openModal}>Добавить культуру</button>
            <aside className='search-filter'>
                <Search/>
                <Dropdown options={getFilterOptions('culture')} placeholder="Выберите тип культуры"  />    
                <Dropdown options={getFilterOptions('type')} placeholder="Выберите культуру"  />
                <Dropdown options={getFilterOptions('greenhouses')} placeholder="Выберите теплицу"  />
                <button className='search-filter__button search-filter__button_black-bold' type='submit '>Применить фильтрацию</button>
                <button className='search-filter__button search-filter__button_grey' type='submit '>Сбросить фильтрацию</button>
            </aside>
          </div>
          <div className='culture-cards'>
            {cultureData.map((card, index) => {
              const image = cultureImageMap[card.name]
              return (
                  <CultureCard key={index} id={card.cultureid} img={image} title={card.name} type={card.type} greenhouses={card.greenhouses}/>
              )})}
          </div>
        </div>

        {/* Модальные окна */}
        {isModelOpen && (
          <div className='modal-overlay'>
            <div className='modal-overlay-conteiner'>
              <span className='modal-overlay__title'>Добавить культуру</span>
              <Input placeholder='Название' type='text' name='name' value={newCulture.name} onChange={handleChange}/>
              <Input placeholder='Тип' type='text' name='type' value={newCulture.type} onChange={handleChange}/>
              <Input placeholder='Температура (°C )' type='text' name='temp' value={newCulture.optimalConditions.temp} onChange={handleChange}/>
              <Input placeholder='Влажность (%)' type='text' name='humidity' value={newCulture.optimalConditions.humidity} onChange={handleChange}/>
              <Input placeholder='Уровень света (Лк)' type='text' name='lightLevel' value={newCulture.optimalConditions.lightLevel} onChange={handleChange}/>
              <div className='conteiner-button'>
                <ButtonOverlay className='button-blue' onClick={handleAddCulture}>Добавить</ButtonOverlay>
                <ButtonOverlay className='button-red' onClick={closeModel}>Отмена</ButtonOverlay>
              </div>
            </div>
          </div>
        )}

        {isDeleteModalOpen && (
          <div className='modal-overlay'>
          <div className='modal-overlay-conteiner'>
            <span className='modal-overlay__title'>Удалить данную культуру?</span>
            <div className='conteiner-button'>
                <ButtonOverlay className='button-blue'>Подтвердить</ButtonOverlay>
                <ButtonOverlay className='button-red' onClick={closeModelDelete}>Отмена</ButtonOverlay>
            </div>
          </div>
        </div>
        )}
      </div>
    )
}