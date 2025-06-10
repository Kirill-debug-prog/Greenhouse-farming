//Типы культур для фильтрации
const type = [
    'Овощная',
    'Ягодная',
    'Зелень',
    'Бобовые',
    'Фруктовая',
    'Зерновая',
];

export {type};


//Варианты культур 
const culture = [
    'Томаты',
    'Баклажаны',
    'Клубника',
    'Халапеньо',
    'Укроп',
    'Огурцы',
    'Мелисса',
];

export {culture}

//Теплицы
const greenhouses = [
    'Теплица №1',
    'Теплица №2',
    'Теплица №3',
    'Теплица №4',
    'Теплица №5',
    'Теплица №6',
    'Теплица №7',
]

export {greenhouses}


// Функция для получения нужного массива по ключу
export function getFilterOptions(key) {
  const data = {
    type,
    culture,
    greenhouses,
  };

  return data[key] || [];
}