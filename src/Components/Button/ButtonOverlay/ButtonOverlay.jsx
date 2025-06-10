import './ButtonOverlay.css'

export default function ButtonTrue({children, className, ...rest}) {
    return (
        <button className={`button-overlay ${className}`} type='submit' {...rest}><span className='text'>{children}</span></button>
    )
}