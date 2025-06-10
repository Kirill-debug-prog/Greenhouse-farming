import tomatoes from '../assets/Culture/Tomatoes.svg'
import eggplant from '../assets/Culture/Eggplant.svg'
import strawberry from '../assets/Culture/Strawberry.svg'
import jalapeno from '../assets/Culture/Jalapeño.svg'

export const greenhousesDate = [
  {
    id: 1,
    name: 'Теплица № 1',
    image: tomatoes,
    temperature: '24',
    humidity: '65',
    lighting: 'Вкл',
    lightLevel: '20000 ',
    status: 'ok',
  },
  {
    id: 2,
    name: 'Теплица № 2',
    image: eggplant,
    temperature: '22',
    humidity: '55',
    lighting: 'Вкл',
    lightLevel: '22000 ',
    status: 'ok',
  },
  {
    id: 3,
    name: 'Теплица № 3',
    image: jalapeno,
    temperature: '26',
    humidity: '63',
    lighting: 'Вкл',
    lightLevel: '23000 ',
    status: 'ok',
  },
  {
    id: 4,
    name: 'Теплица № 4',
    image: '', // нет изображения
    temperature: null,
    humidity: null,
    lighting: 'Вкл',
    lightLevel: null,
    status: 'offline', // теплица не работает
  },
  {
    id: 5,
    name: 'Теплица № 5',
    image: strawberry,
    temperature: '21',
    humidity: null,
    lighting: 'Вкл',
    lightLevel: '26000 ',
    status: 'sensor-error', // ошибка датчика
  },
  {
    id: 6,
    name: 'Теплица № 6',
    image: jalapeno,
    temperature: '25',
    humidity: '65',
    lighting: 'Вкл',
    lightLevel: '20000 ',
    status: 'ok',
  },
  {
    id: 7,
    name: 'Теплица № 7',
    image: strawberry,
    temperature: '24',
    humidity: '60',
    lighting: 'Вкл',
    lightLevel: '23000 ',
    status: 'ok',
  },
]
