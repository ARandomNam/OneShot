import { useState, useEffect } from 'react';
import UserTab from './UserTab';
import MediaPreviewer from './MediaPreviewer';
import TimelineEditor from './TimelineEditor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import './css/MainPage.css';


const MainPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleCheckboxChange = () => {
    setIsDarkMode(!isDarkMode);
  };


  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="color"></div>
        <div className="color"></div>
        <div className="color"></div>
        <div className='square' style={{'--i':3}}></div>
        <div className='square' style={{'--i':8}}></div>
        <div className='square' style={{'--i':2}}></div>

        <div className="ICON">
          <img src="../picture/icon.jpg" alt="OneShot 🚀💫" />
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', width: '80%' }}>

          <div>
            <UserTab isDark={isDarkMode}/>
          </div>

          <div className="Upload">
            <MediaPreviewer />
          </div>
          <div className="Timeline">
            <TimelineEditor />
          </div>
          
          <div className='checkbox-container'>
          <input
            type="checkbox"
            className="checkbox"
            id="checkbox"
            checked={isDarkMode}
            onChange={handleCheckboxChange}
          />
          <label htmlFor="checkbox" className="checkbox-label">
            <FontAwesomeIcon icon={faMoon} />
            <FontAwesomeIcon icon={faSun} />
            <span className="ball"></span>
          </label>
          </div>

        </div>
        <div className="top-rectangle"></div>
      </div>
    </div>
  );
}



export default MainPage