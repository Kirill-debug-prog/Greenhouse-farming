import './InputRadio.css';

export default function InputRadio({ className = '', children, id, name, value, checked, onChange, ...rest }) {
  return (
    <div className="container-radio">
      <label className="label-name" htmlFor={id}>
        {children}
        <input
          id={id}
          name={name}
          type="radio"
          value={value}
          checked={checked}
          onChange={onChange}
          className={`radio-input ${className}`}
          {...rest}
        />
      </label>
    </div>
  );
}
