import './Header.css';
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const navigate = useNavigate();

    const handleLogount = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
        localStorage.removeItem('expires');
        localStorage.setItem('expiredMessage', 'Ваша сессия устарела.');
        navigate('/login');
    }

    return (
        <div className='header-content'>
            <div className='header-body'>
                <div className="header-logo">
                    <span className="header-logo-text">Тепличное хозяйство</span>
                </div>
                <nav className="header-nav">
                    <ul className="header-nav-list">
                        <li className="header-nav-list-item">
                            <a href="#" className="header-nav-list-item-link">Главная</a>
                        </li>
                        <li className="header-nav-list-item">
                            <a href="#" className="header-nav-list-item-link" onClick={handleLogount}>Выход</a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    )
}