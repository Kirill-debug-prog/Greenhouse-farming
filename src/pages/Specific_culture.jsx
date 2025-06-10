import '../style/Specific_culture.css'
import img_teh from '../assets/img_teh.svg'
import Button from '../Components/Button/Butten_culture/Butten_culture.jsx'
import { useParams } from 'react-router-dom'
import { card } from '../helpers/cardCulture.js'
import { useState } from 'react'
import ButtonOverlay from '../Components/Button/ButtonOverlay/ButtonOverlay.jsx'
import Input from '../Components/Input/InputSymbol/InputSymbol.jsx'
import Dropdown from '../Components/Dropdown/Dropdown.jsx'
import InputRadio from '../Components/Input/InputRadio/InputRadio.jsx'
import { cultureImageMap } from '../helpers/cultureImageMap.js'
import { useEffect } from 'react'


function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  if (match) return match[2]
}

function redirectToLogin() {
  localStorage.setItem('expiredMessage', 'Ваша сессия устарела.')
  window.location.href = '/login'
}

export default function SpecificCulture() {
    const [isModelOpen, setIsModelOpen] = useState(false)
    const [selectedValue, setSelectedValue] = useState('');
    const [cultureDateById, setCultureDateById] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const {id} = useParams()
    const cultureId = Number(id)
    if (isNaN(cultureId)) return <div className='noData'>Неверный ID культуры </div>

    useEffect(() => {
      const token = getCookie('token') || localStorage.getItem('token')

      if (!token) {
        redirectToLogin()
        return
      }

      setLoading(true)
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
          setCultureDateById(data)
          setError(null)
          setLoading(false)
        })
        .catch((err) => {
          setError(err.message)
          setLoading(false)
        })
    }, [cultureId])


    const openModel = () => setIsModelOpen(true)
    const closeModal = () => setIsModelOpen(false)

    if (loading) return <div>Загрузка...</div>
    if (error) return <div className='noData'><b>Культура не найдена</b></div>
    if (!cultureDateById) return <div>Данные отсутствуют</div>

    const image = cultureImageMap[cultureDateById.name]

    const goToCalendar = () => {
      window.location.href = `/culture/${cultureId}/calendar`
    }

    return (
        <div className='main-specific_culture'>
            <div className='content'>
                <div className="title"><span>Культура</span></div>
                <div className='container__culture'>
                    <div className="conteiner__culture__info-agronom">
                        <img className="img-specific-culture" src={image} alt={cultureDateById.name}/>
                        <div className='container-culture-name'>
                            <div className="culture-name-agronom"><strong>Название:</strong> <span>{cultureDateById.name}</span></div>
                            <div className="culture-name-agronom"><strong>Тип:</strong> <span>{cultureDateById.type}</span></div>
                        </div>
                    </div>
                    <div className='container__culture__button'>
                        <Button as='a' onClick={goToCalendar}>График</Button>
                        <Button onClick={openModel} >Создать отчет</Button>
                    </div>
                </div>
                <div className='container__description'>
                    <div className='container__description__block'>
                        <div className='block__title'>Оптимальные условия</div>
                        <ul className='block__list'>
                            <li><strong>Температура:</strong> {cultureDateById.optimalConditions?.temp ?? 'Нет данных'} °C</li>
                            <li><strong>Влажность:</strong> {cultureDateById.optimalConditions?.humidity ?? 'Нет данных'}</li>
                            <li><strong>Освещенность:</strong> {cultureDateById.optimalConditions?.lightlevel ?? 'Нет данных'} Лк</li>
                        </ul>
                    </div>
                    {cultureDateById.amountharvested && (
                      <div className='container__description__block'>
                        <div className='block__title'>Урожайность</div>
                        <ul className='block__list'>
                          <li><strong>Прошлый сезон:</strong> {cultureDateById.amountharvested} кг/м<sup>2</sup></li>
                        </ul>
                      </div>
                    )}

                </div>
            </div>
            <img className="img-right-background" src={img_teh} alt=''/>

            {isModelOpen && (
                <div className='modal-overlay'>
                    <div className='modal-overlay-conteiner'>
                        <span className='modal-overlay__title'></span>
                        <Input placeholder='Начало' type='date' />
                        <Input placeholder='Конец' type='date' />
                        <Dropdown placeholder='Тип отчёта' />
                        <div className='radio-container'>
                        <InputRadio
                          id="report1"
                          name="reportType"
                          value="pdf"
                          checked={selectedValue === 'pdf'}
                          onChange={(e) => setSelectedValue(e.target.value)}
                          className='color'
                        >
                          PDF
                        </InputRadio>
                        <InputRadio
                            id="report2"
                            name="reportType"
                            value="excel"
                            checked={selectedValue === 'excel'}
                            onChange={(e) => setSelectedValue(e.target.value)}
                            className='color'
                          >
                            Excel
                        </InputRadio>
                        <InputRadio
                            id="report3"
                            name="reportType"
                            value="word"
                            checked={selectedValue === 'word'}
                            onChange={(e) => setSelectedValue(e.target.value)}
                            className='color'
                          >
                            Word
                        </InputRadio>
                        </div>
                        <div className='conteiner-button'>
                            <ButtonOverlay className='button-blue'>Сформировать</ButtonOverlay>
                            <ButtonOverlay className='button-red' onClick={closeModal}>Отмена</ButtonOverlay>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}