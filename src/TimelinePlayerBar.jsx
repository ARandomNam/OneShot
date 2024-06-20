import { useEffect, useState } from 'react';
import './css/TimelinePlayerBar.css'



const TimelinePlayerBar = ({ timelineState, autoScrollWhenPlay, scale }) => {

  const playbackSpeedOptions = [0.2, 0.5, 1.0, 1.5, 2.0];

  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setPlayingTime] = useState(0);


  // Control Play or pause
  const togglePlayOrPause = () => {
    if (!timelineState.current) return;
    
    if (timelineState.current.isPlaying) {
      timelineState.current.pause();
    } else {
      timelineState.current.play({ autoEnd: true });
    }
  };


  // For the custom 00:00:00:00 time scale displayed
  const playingTimeDisplay = (time) => {

    const timeInHours = Math.floor(time / 3600);
    const timeInMinutes = Math.floor((time % 3600) / 60);
    const timeInSeconds = Math.floor(time % 60);
    const timeInMilliseconds = Math.floor((time % 1) * 100);
  
    const formattedHours = String(timeInHours).padStart(2, '0');
    const formattedMins = String(timeInMinutes).padStart(2, '0');
    const formattedSec = String(timeInSeconds).padStart(2, '0');
    const formattedMicroSec = String(timeInMilliseconds).padStart(2, '0');
  
    return <>{`${formattedHours}:${formattedMins}:${formattedSec}.${formattedMicroSec}`}</>;
  };  


  // Change playback speed
  const changePlaybackSpeed = (playbackSpeed) => {
    if (!timelineState.current) return;

    timelineState.current.setPlayRate(playbackSpeed);
  };


  // Manage useState and handle the autoscolling while playing
  useEffect(() => {
    if (!timelineState.current) return;

    const timelineCurrentState = timelineState.current;
    timelineCurrentState.listener.on('play', () => setIsPlaying(true));
    timelineCurrentState.listener.on('paused', () => setIsPlaying(false));
    timelineCurrentState.listener.on('afterSetTime', ({ time }) => setPlayingTime(time));
    timelineCurrentState.listener.on('setTimeByTick', ({ time }) => {
      setPlayingTime(time);

      const scaleWidth = 160;
      const offset = 800;
      // ISSUE !!!! There is an issue below where the scale variable is always at its initial value and don't change according to what scale actually is at any moment in time  // We need the variable to change in order for the autoscrolling to work at any scale
      const cursorPosition = time * (scaleWidth / scale) - offset;  // relative to autoScrollWhenPlay point  // May have to be changed later

      if (cursorPosition >= 0 && autoScrollWhenPlay) {
        timelineState.current.setScrollLeft(cursorPosition);
      }
    });

    return () => {
      if (!timelineCurrentState) return;
      timelineCurrentState.pause();
      timelineCurrentState.listener.offAll();
    };
  }, [timelineState]);



  return (
    <div className="timelinePlayerBar">
      <button className="playOrPauseButton" onClick={togglePlayOrPause}>
          {isPlaying ? <img className="play_pause_icon" src="../picture/Pause.png" alt="playing"/> : <img className="play_pause_icon" src="../picture/Play.png" alt="paused"/>}
      </button>
      <div className="displayTime">{playingTimeDisplay(time)}</div>
      <div className="playerSpeedControl">
        {playbackSpeedOptions.map((playbackSpeedOption) => (
          <label key={playbackSpeedOption}>
            <input
              type="radio"
              name="playbackSpeedOption"
              value={playbackSpeedOption}
              onChange={(e) => changePlaybackSpeed(parseFloat(e.target.value))}
              defaultChecked={playbackSpeedOption === 1.0}
            />
            {`${playbackSpeedOption.toFixed(1)}x`}
          </label>
        ))}
      </div>
    </div>
  );
};



export default TimelinePlayerBar;