import tomatoes from '../assets/Culture/Tomatoes.svg'
import eggplant from '../assets/Culture/Eggplant.svg'
import strawberry from '../assets/Culture/Strawberry.svg'
import jalapeno from '../assets/Culture/Jalapeño.svg'

const card = [
  {
    id: 1,
    img: tomatoes,
    title: 'Томаты',
    type: 'Овощная',
    greenhouses: 'Теплица №1',
    conditions: {
      temp: '22–26' ,
      humidity: '60–70%',
      litinght: '12–14',
      light: '20000–25000',
    },
  },
  {
    id: 2,
    img: eggplant,
    title: 'Баклажаны',
    type: 'Овощная',
    greenhouses: 'Теплица №2',
    conditions: {
      temp: '24–28',
      humidity: '65–75',
      litinght: '12',
      light: '22000',
    },
  },
  {
    id: 3,
    img: strawberry,
    title: 'Клубника',
    type: 'Ягодная',
    greenhouses: 'Теплица №5, Теплица №7',
    conditions: {
      temp: '18–22',
      humidity: '70–80',
      litinght: '10–12',
      light: '18000',
    },
  },
  {
    id: 4,
    img: jalapeno,
    title: 'Халапеньо',
    type: 'Овощная',
    greenhouses: 'Теплица №3, Теплица №6',
    conditions: {
      temp: '23–27',
      humidity: '60–70',
      litinght: '13–14',
      light: '20000',
    },
  },
]

export { card }
