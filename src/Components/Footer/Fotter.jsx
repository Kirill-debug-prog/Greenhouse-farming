import './Footer.css';

export default function Footer() {
    return (
        <div className='footer-content'>
           <div className='footer-body'>
            <div className='footer-left-content'>
                 <div className='footer-body__name'>Тепличное хозяйство © 2025</div>
                 <div className='footer-documentation'>
                     <a href='#' className='footer-documentation__content'>Пользовательское соглашение</a>
                     <a href='#' className='footer-documentation__content'>Политика конфиденциальности</a>
                 </div>
             </div>
             <div className='footer-right-content'>
                     <a href='#' className='fotter-info-content'>support@example.com</a>
                     <span className='fotter-info-content'>Версия 1.0.0</span>
                     <span className='fotter-info-content'>Разработанное в рамках учебного проекта</span>
                     <span className='fotter-info-content'>Последнее обновление <strong>май 2025</strong></span>
                 </div>
           </div>
        </div>
    )
}