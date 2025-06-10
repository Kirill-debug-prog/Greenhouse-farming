import './Butten_culture.css'
import pen from'../../../assets/pen.svg'

export default function ReusableButton({ as = 'button', href, children, ...props }) {
  const Tag = as;

  return (
    <Tag
      {...props}
      {...(as === 'a' && href ? { href } : {})}
      className="button"
    >
      <img src={pen} alt='pen'></img>
      <span>{children}</span>
    </Tag>
  );
}
