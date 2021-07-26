import Twitter from '../../assets/images/Twitter';
import Github from '../../assets/images/Github';

const Footer = () => {
  return (
    <div className='footer-basic'>
      <footer>
        <div className='social'>
          <a
            href='https://github.com/FabienCoutant/SparkUp'
            target='_blank'
            rel='noreferrer'
          >
            <Github />
          </a>
          <a href='#'>
            <Twitter />
          </a>
        </div>
        <ul className='list-inline'>
          <li className='list-inline-item'>Home</li>
          <li className='list-inline-item'>Services</li>
          <li className='list-inline-item'>About</li>
          <li className='list-inline-item'>Terms</li>
          <li className='list-inline-item'>Privacy Policy</li>
        </ul>
        <p className='copyright'>Company Name © 2021</p>
      </footer>
    </div>
  );
};

export default Footer;
