import '../style/Specific_crop_agronomist.css'
import img_teh from '../assets/img_agr.png'
import { useParams } from 'react-router-dom'
import { card } from '../helpers/cardCulture'

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  if (match) return match[2]
}

function redirectToLogin() {
  localStorage.setItem('expiredMessage', 'Ваша сессия устарела.')
  window.location.href = '/login'
}

export default function SpecificCulture() {
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


    if (loading) return <div>Загрузка...</div>
    if (error) return <div className='noData'><b>Культура не найдена</b></div>
    if (!cultureDateById) return <div>Данные отсутствуют</div>

    const image = cultureImageMap[cultureDateById.name]

    return (
        <div className='main-specific_crop_agronomist'>
            <div className='content'>
                <div className="title"><span>Культура</span></div>
                <div className='container__culture'>
                    <div className="conteiner__culture__info">
                        <img className="img-culture" src={image} alt=''/>
                        <div className='container-culture-name'>
                            <div className="culture-name"><strong>Название:</strong> <span>{cultureDateById.name}</span></div>
                            <div className="culture-name"><strong>Тип:</strong> <span>{cultureDateById.type}</span></div>
                        </div>
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
                    <div className='container__description__block'>
                        <div className='block__title'>Урожайность</div>
                        <ul className='block__list'>
                            <li><strong>Прошлый сезон:</strong> {cultureDateById.amountharvested} кг/м<sup>2</sup></li>
                        </ul>
                    </div>
                </div>
            </div>
            <img className="img-right-background" src={img_teh} alt=''/>
        </div>
    )
}