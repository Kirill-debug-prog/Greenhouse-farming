import InputSymbol from "../Components/Input/InputSymbol/InputSymbol"
import Dropdown from '../Components/Dropdown/Dropdown.jsx'
import { getFilterOptions } from "../helpers/filteringOptions"
import '../style/Plan_calendar.css'
import buttonView from '../assets/button-view.svg'
import Calendar from '../Components/CalendarModels/Calendar/Calendar.jsx'
import { use, useEffect } from "react"
import { useState } from "react"
import { useParams } from 'react-router-dom'
import { Label } from "@headlessui/react"
import { selectClasses } from "@mui/material"


function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    if (match) return match[2]
}

function redirectToLogin() {
    localStorage.setItem('expiredMessage', 'Ваша сессия устарела.')
    window.location.href = '/login'
}

  export default function PlanCalendar() {
     const [cultureName, setCultureName] = useState(null)
     const [greenhouses, setGreenhouses] = useState([])
     const [selectedGreenhouse, setSelectedGreenhouse] = useState(null);
     const [calendarKey, setCalendarKey] = useState(0)

     const refreshCalendar = () =>{
        setCalendarKey(prev => prev + 1)
     }


    const {id} = useParams()
    const cultureId = Number(id)

    useEffect(() => {
        const token = getCookie('token') || localStorage.getItem('token')

        if (!token) {
            redirectToLogin()
            return
        }

        fetch(`http://localhost:5180/api/cultures/${cultureId}`, {
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
            setCultureName(data.name)
        })
        .catch((err) => {
            console.error('Ошибка при получении данных:', err)
        })

        fetch(`http://localhost:5180/api/workings/greenhouses-for-culture/${cultureId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
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
            
            setGreenhouses(data)
            console.log('Теплицы:', data)

            if (data.length > 0) {
                setSelectedGreenhouse(data[0]) // Устанавливаем первый элемент как выбранный по умолчанию
            }
        })
        .catch((err) => {
            console.error('Ошибка при получении данных:', err)
        })
    }, [cultureId])


    console.log('selectedGreenhouse:', selectedGreenhouse)
    console.log('greenhouseId для передачи в Calendar:', selectedGreenhouse?.greenhousenumber)


    return (
        <div className='main-plan'>
            <div className='titel'>
                <h1>График: {cultureName} </h1>
            </div>
            <div className='plan'>
                <div className='variant-data'>
                    <div className='dropdown-varient-container'>
                        <div className='name-dropdown'>Месяц/Год:</div>
                        <InputSymbol placeholder='месяц' type='month'/>
                        <div className='name-dropdown'>Теплица:</div>
                        <Dropdown
                          options={greenhouses}
                          placeholder="Выберите теплицу"
                          value={selectedGreenhouse}
                          onChange={setSelectedGreenhouse}
                          getOptionLabel={(item) => item.greenhouseName}
                          getOptionKey={(item) => item.greenhousenumber}
                        />

                    </div>
                    <div className='variant-work'>
                        <div className='variant-block variant_water'></div>
                        <div className='name-work'>Полив</div>
                        <div className='variant-block variant_fertilizer'></div>
                        <div className='name-work'>Удобрение</div>
                        <div className='variant-block variant_sowing'></div>
                        <div className='name-work'>Посев</div>
                    </div>
                </div>
                <div className='plan-container'>
                        <Calendar 
                            key={calendarKey}
                            greenhouseId={selectedGreenhouse?.greenhousenumber}
                            token={getCookie('token') || localStorage.getItem('token')}
                            cultureId={cultureId}
                            onRefreshCalendar={refreshCalendar}
                        />
                    </div>
            </div>
        </div>
    )
  }