import './InputSymbol.css'

export default function InputSymbol({placeholder, ...rest}) {
    return (
        <input className='input-content' placeholder={placeholder} {...rest} />
    )
}