import './GreenhousesCard.css'
import noDateImg from '../../assets/noData.svg'
import dontWork from '../../assets/dontWork.svg'
import { useNavigate } from 'react-router-dom';

function renderValue(value, unit = '') {
  const noData = value === null || value === undefined;

  return (
    <span className='value-wrapper'>
      {noData ? '--' : `${value} ${unit}`}
      {noData && (
        <span className='tooltip-container'>
          <img className='tooltip-icon' src={noDateImg} alt=''></img>
          <span className='tooltip-text-noData'>Нет данных с датчика</span>
        </span>
      )}
    </span>
  );
}

export default function GreenhouseCard({ id, img, name, temperature, humidity, light, lightLevel, status }) {
  // const navigate = useNavigate()

  // function handleClick() {
  //   navigate(`/greenhouse/${id}`)
  // }
  return (
    <div className={`greenhouse-card ${status === 'offline' ? 'card-offline' : ''}`}>
        {(status === 'offline') && (
            <div className='tooltip-container-position'>
                <div className='tooltip-container'>
                    <img className='tooltip-icon-work' src={dontWork} alt=''></img>
                    <span className='tooltip-text'>Теплица не работает</span>
                </div>
            </div>
          )}
      <div className='greenhouse-card__img-card'>
        {img ? (
              <img className="img-card__img" src={img} alt="Культура" />
            ) : (
              <div className="img-placeholder">Нет изображения</div>
            )}
      </div>
      <div className='greenhouse-card-content'>
        <div className='greenhouse-card__name'>
          {name}
        </div>
        <div className='greenhouse-card__info'>
          <label className='greenhouse-card__info__discription text_style'>Температура:</label>
          <div className='greenhouse-card__info__data text_style'>{renderValue(temperature, '°C')}</div>

          <label className='greenhouse-card__info__discription text_style'>Влажность:</label>
          <div className='greenhouse-card__info__data text_style'>{renderValue(humidity, '%')}</div>

          <label className='greenhouse-card__info__discription text_style'>Освещённость:</label>
          <div className='greenhouse-card__info__data text_style'>{renderValue(light)}</div>

          <label className='greenhouse-card__info__discription text_style'>Уровень света:</label>
          <div className='greenhouse-card__info__data text_style'>{renderValue(lightLevel, 'Лк')}</div>
        </div>
      </div>
    </div>
  )
}
