import './Search.css';
import search from '../../assets/search.png';

export default function Search() {
    return (
            <form className='search-from'>
                <h2 className='visually-hidden'>Поиск и фильтрация</h2>
                <label className='visually-hidden' htmlFor='search'>Поиск</label>
                <input className='search-from__input placeholder' type='search' placeholder='Поиск по названию'/>
                <button className='search-from__button' type='submit' style={{ background: `url(${search}) no-repeat center` }}>
                    <span className='visually-hidden'>Поиск</span>
                </button>
            </form>
    )
}