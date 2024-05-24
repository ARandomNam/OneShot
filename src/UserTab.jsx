import { useState, useEffect } from 'react';
import AICommandBox from './AICommandBox';
import StockMediaBox from './StockMediaBox';
import './css/UserTab.css';



const UserTab = ({ isDark }) => {
  const [activeTab, setActiveTab] = useState(2);

  const switchTab = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  const [selectedOption, setSelectedOption] = useState('video');

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  useEffect(() => {
    const tabs = document.querySelector('.tabs');
    if (tabs) {
      const tabsHeader = tabs.querySelector('.tabs-header');
      const tabsPanel = tabs.querySelectorAll('.tabs-panel');
      let activeTab = tabsHeader.children[0];
      let activePanel = tabsPanel[0];
      const activeTabIndicator = document.createElement('span');
      activeTabIndicator.className = 'active-tab-indicator';

      tabs.appendChild(activeTabIndicator);

      const activateTab = (tab, i) => {
        tabsHeader.querySelectorAll('button').forEach((button) => {
          button.removeAttribute('aria-selected');
          button.style.color = isDark ? '#acb3d4' : '#555';
        });

        tab.setAttribute('aria-selected', true);
        tab.style.color = isDark ? '#fbfbfb' : '#0084b5';
        activeTab = tab;

        tabsPanel.forEach((panel) => {
          panel.setAttribute('hidden', true);
        });

        tabsPanel[i].removeAttribute('hidden');
        activePanel = tabsPanel[i];

        activeTab.focus();

        const leftPercent = (activeTab.offsetLeft / tabsHeader.offsetWidth) * 100;
        
        activeTabIndicator.style.width = activeTab.offsetWidth + 'px';
        activeTabIndicator.style.left = leftPercent + 7 + '%';
      };

      activateTab(activeTab, 0);

      tabs.addEventListener('keydown', (e) => {
        const i = Array.from(tabsHeader.children).indexOf(activeTab);

        if (e.keyCode === 39) {
          if (activeTab.nextElementSibling) {
            activateTab(activeTab.nextElementSibling, i + 1);
          } else {
            activateTab(tabsHeader.children[0], 0);
          }
        }

        if (e.keyCode === 37) {
          if (activeTab.previousElementSibling) {
            activateTab(activeTab.previousElementSibling, i - 1);
          } else {
            const lastIndex = tabsHeader.children.length - 1;
            activateTab(tabsHeader.children[lastIndex], lastIndex);
          }
        }
      });

      Array.from(tabsHeader.children).forEach((tab, i) => {
        tab.addEventListener('click', () => activateTab(tab, i));
      });
    }
  }, [isDark]);

  return (

    <div>
      <div className={`tabs ${isDark ? 'dark' : ''}`}>
        <div className="tabs-header" role="tablist" aria-label="my-tabs">
          <button role="tab" aria-selected="true" tabIndex="0">
            StockMediaBox
          </button>
          <button role="tab" aria-selected="false" tabIndex="-1">
            AICommandBox
          </button>
        </div>

        <div className="tabs-panel" tabIndex="0" role="tabpanel">
          <div className="panel">
            <select className="Video-audio-Select" value={selectedOption} onChange={handleSelectChange}>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
            </select>

            <StockMediaBox isDark={isDark}/>

          </div>
        </div>
        
        <div className="tabs-panel" tabIndex="-1" role="tabpanel">
          <div className="panel">

            <AICommandBox />

          </div>
        </div>

      </div>

    </div>
  );
}



export default UserTab;