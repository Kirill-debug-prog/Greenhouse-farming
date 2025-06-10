import './CultureCard.css'
import { Link } from 'react-router-dom'

export default function CultureCard ({id, img, title, type, greenhouses, onDelete}) {
    return (
        <div className='culture-card'>
            <div className='culture-card__img-card'>
                <img className='img-card__img_culture' src={img} alt={title}/>
            </div>
            <div className='culture-card__card_info'>
                <span className='card_info__name'>{title}</span>
                <span className='card_info__type'>{type}</span>
            </div>
            <div className='culture-card__greenHouse-card'>
                {greenhouses.map((name, index) => (
                    <div key={index} className='greenHouse-card__name'><span>{name}</span></div>
                ))}
            </div>
            <div className='culture-card__button-card'>
                 <Link to={`/culture/${id}`} className='butten-card__open-culture'>Открыть</Link>
                <button type='button' className='butten-card__delete-culture' onClick={() => onDelete(id)}>Удалить</button>
            </div>
        </div>
    )
}