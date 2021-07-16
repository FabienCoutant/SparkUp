import Twitter from '../../assets/images/Twitter';
import Github from '../../assets/images/Github';

const Footer = () => {
  return (
    <div className='footer-basic'>
      <footer>
        <div className='social'>
          <a href='#'>
            <Github />
          </a>
          <a href='#'>
            <Twitter />
          </a>
        </div>
        <ul className='list-inline'>
          <li className='list-inline-item'>
            <a href='#'>Home</a>
          </li>
          <li className='list-inline-item'>
            <a href='#'>Services</a>
          </li>
          <li className='list-inline-item'>
            <a href='#'>About</a>
          </li>
          <li className='list-inline-item'>
            <a href='#'>Terms</a>
          </li>
          <li className='list-inline-item'>
            <a href='#'>Privacy Policy</a>
          </li>
        </ul>
        <p className='copyright'>Company Name © 2021</p>
      </footer>
    </div>
  );
};

export default Footer;
