import { useState, useEffect, useRef } from 'react';
import { Timeline } from '@xzdarcy/react-timeline-editor';
import { useSelector } from 'react-redux';
import TimelinePlayerBar from './TimelinePlayerBar';
import { mockEffect } from './mockEffect';
// import './css/TimelineEditor.css' // see if useful later on



// For the custom 00:00:00 time scale
const CustomScale = (scaleObject) => {

    const scale = scaleObject.scale;

    const durationInSeconds = scale;
    const numOfHours = Math.floor(durationInSeconds / 3600);
    const remainingSeconds = durationInSeconds - 3600*numOfHours;
    const numOfMins = Math.floor(remainingSeconds / 60);
    const numOfSec = Math.floor(remainingSeconds % 60);

    const formattedHours = String(numOfHours).padStart(2, '0');
    const formattedMins = String(numOfMins).padStart(2, '0');
    const formattedSec = String(numOfSec).padStart(2, '0');

    const minLongVideo = true;
    let hourLongVideo = true;

    // if (numOfHours != 0) {
    //     hourLongVideo = true;
    // }

    return (
        <div style={{ whiteSpace: 'nowrap' }}>
            {hourLongVideo ? `${formattedHours}:${formattedMins}:${formattedSec}` : (minLongVideo ? `${formattedMins}:${formattedSec}` : `${formattedSec}`)}
        </div>
    );
}


  
const TimelineEditor = () => {

    // Get timelineData from React Redux store
    const timelineData = useSelector(state => state.timeline.timelineData);


    // For scrollwheel scale adjustment
    const [scale, setScale] = useState(10);

    const timelineRef = useRef(null);

    useEffect(() => {
        const adjustTimelineScale = (event) => {
            if (event.ctrlKey && event.deltaY !== 0) {  // event.ctrlKey only useful for when using mouse
                event.preventDefault();  // Prevent default zoom behavior
                const newScale = Math.max(scale + event.deltaY * 3, 1);
                setScale(newScale);
            }
        };

        const element = timelineRef.current;
        element.addEventListener('wheel', adjustTimelineScale, { passive: false });

        return () => {
            element.removeEventListener('wheel', adjustTimelineScale);
        };
    }, [scale]);


    // For TimelinePlayerBar
    const timelineState = useRef(null);



    return (
        <div className="Timeline" ref={timelineRef}>
        
            <TimelinePlayerBar timelineState={timelineState} autoScrollWhenPlay={true} scale={scale} />

            <Timeline
            editorData={timelineData}
            effects={mockEffect}
            style={{width: '100%', height: '100%'}}
            onChange={() => {console.log('change')}}
            autoScroll={true}
            ref={timelineState}
            scale={scale}
            getScaleRender={(scaleObject) => <CustomScale scale={scaleObject}/>}
            />
        </div>
    );
};



export default TimelineEditor;