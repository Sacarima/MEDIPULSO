// PatientHeader.jsx
import { Link } from 'react-router-dom';
import logo from '../assets/medipulso.png'; // Replace with your logo path
import logoDarkMode from '../assets/logoDarkMode-1.png';
import { Button } from 'flowbite-react';
import { useSelector } from 'react-redux';

const DoctorHeader = () => {
  const { theme } = useSelector(state => state.theme);

  return (
    <div className='border-b-[0.5px]'>
        <header className="flex justify-between py-3 sm:w-[70%] sm:m-auto">
          <Link to="/">
            <img src={theme === 'dark' ? logoDarkMode : logo} alt="logo" className="w-32" />
          </Link>
          <Link to='/login'>
            <Button
              outline gradientDuoTone="greenToBlue" size='sm'
            
            >
              Login
            </Button>
          </Link>
        </header>
    </div>
  );
};

export default DoctorHeader;
