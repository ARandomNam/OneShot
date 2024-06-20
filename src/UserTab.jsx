import { useState, useEffect, useRef } from 'react';
import AICommandBox from './AICommandBox';
import StockMediaBox from './StockMediaBox';
import './css/UserTab.css';

const UserTab = ({ isDark }) => {
  const [activeTab, setActiveTab] = useState(0); // Use 0 as the initial active tab index
  const tabsRef = useRef(null);

  const switchTab = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  useEffect(() => {
    const tabs = tabsRef.current;
    if (tabs) {
      const tabsHeader = tabs.querySelector('.tabs-header');
      const tabsPanel = tabs.querySelectorAll('.tabs-panel');
      let activeTabElement = tabsHeader.children[activeTab];
      const activeTabIndicator = document.createElement('span');
      activeTabIndicator.className = 'active-tab-indicator';

      tabs.appendChild(activeTabIndicator);

      const activateTab = (tab, i) => {
        if (!tab) return;
        tabsHeader.querySelectorAll('button').forEach((button) => {
          button.removeAttribute('aria-selected');
          button.style.color = isDark ? '#acb3d4' : '#555';
        });

        tab.setAttribute('aria-selected', true);
        tab.style.color = isDark ? '#fbfbfb' : '#0084b5';

        tabsPanel.forEach((panel) => {
          panel.setAttribute('hidden', true);
        });

        if (tabsPanel[i]) {
          tabsPanel[i].removeAttribute('hidden');
        }

        const leftPercent = (tab.offsetLeft / tabsHeader.offsetWidth) * 100;
        activeTabIndicator.style.width = tab.offsetWidth + 'px';
        activeTabIndicator.style.left = leftPercent + 7 + '%';
      };

      // Activate the currently active tab based on the state
      activateTab(activeTabElement, activeTab);

      tabs.addEventListener('keydown', (e) => {
        const i = Array.from(tabsHeader.children).indexOf(activeTabElement);

        if (e.keyCode === 39) {
          if (activeTabElement.nextElementSibling) {
            activateTab(activeTabElement.nextElementSibling, i + 1);
          } else {
            activateTab(tabsHeader.children[0], 0);
          }
        }

        if (e.keyCode === 37) {
          if (activeTabElement.previousElementSibling) {
            activateTab(activeTabElement.previousElementSibling, i - 1);
          } else {
            const lastIndex = tabsHeader.children.length - 1;
            activateTab(tabsHeader.children[lastIndex], lastIndex);
          }
        }
      });

      Array.from(tabsHeader.children).forEach((tab, i) => {
        tab.addEventListener('click', () => {
          switchTab(i); // Update the state when a tab is clicked
          activateTab(tab, i);
        });
      });
    }
  }, [isDark, activeTab]); // Add activeTab to the dependency array

  return (
    <div>
      <div className={`tabs ${isDark ? 'dark' : ''}`} ref={tabsRef}>
        <div className="tabs-header" role="tablist" aria-label="my-tabs">
          <button role="tab" aria-selected={activeTab === 0} tabIndex={activeTab === 0 ? 0 : -1}>
            StockMediaBox
          </button>
          <button role="tab" aria-selected={activeTab === 1} tabIndex={activeTab === 1 ? 0 : -1}>
            AICommandBox
          </button>
        </div>

        <div className="tabs-panel" tabIndex={activeTab === 0 ? 0 : -1} role="tabpanel">
          <div className="panel">
            <StockMediaBox isDark={isDark} /> {/* ISSUE !!!! dark theme can be implemented without putting isDark as an argument? */}
          </div>
        </div>

        <div className="tabs-panel" tabIndex={activeTab === 1 ? 0 : -1} role="tabpanel">
          <div className="panel">
            <AICommandBox />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTab;
