// !!! ISSUE Add loading animation for all the media fetching

import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import axios from 'axios';
import './css/StockMediaBox.css';
import { useDispatch } from 'react-redux';
import { previewMediaAction, setMediaTypeAction, setPreviewerLoadingAction } from './redux/actions.js';

const StockMediaBox = ({ isDark }) => {
    
    // useState
    const [imageQuery, setImageQuery] = useState('');
    const [videoQuery, setVideoQuery] = useState('');
    const [lottieQuery, setLottieQuery] = useState('');
    const [soundtrackQuery, setSoundtrackQuery] = useState('');

    const [images, setImages] = useState([]);
    const [videos, setVideos] = useState([]);
    const [lottieAnimations, setLottieAnimations] = useState([]);
    const [soundtracks, setSoundtracks] = useState([]);

    const [visibleGrid, setVisibleGrid] = useState('none');


    // PEXELS API Key
    const pexelsApiKey = import.meta.env.VITE_PEXELS_API_KEY;

    // Jamendo API Key
    const jamendoClientId = import.meta.env.VITE_JAMENDO_CLIENT_ID;

    // Lottie Files API Key
    // !!! ISSUE Cannot find any api key for lottiefiles
    const lottieFilesApiKey = 'YOUR_LOTTIEFILES_API_KEY';


    
    const handleSearchImageButtonClick = () => {
        setVisibleGrid('imageGrid');
        fetchImages();
    };
    const handleSearchVideoButtonClick = () => {
        setVisibleGrid('videoGrid');
        fetchVideos();
    };

    const handleSearchLottieAnimationButtonClick = () => {
        setVisibleGrid('lottieGrid');
        fetchLottieAnimations();
    };

    const handleSongsButtonClick = () => {
        fetchSoundtracks();
    };



    // Fetching Stock images
    const fetchImages = async () => {
        try {
            const response = await axios.get(`https://api.pexels.com/v1/search?query=${imageQuery}&per_page=10`, {
                headers: {
                    Authorization: pexelsApiKey,
                },
            });
            setImages(response.data.photos);
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    };

    // Fetching stock videos
    const fetchVideos = async () => {
        try {
            const response = await axios.get(`https://api.pexels.com/videos/search?query=${videoQuery}&per_page=10`, {
                headers: {
                    Authorization: pexelsApiKey,
                },
            });
            setVideos(response.data.videos);
        } catch (error) {
            console.error('Error fetching videos:', error);
        }
    };

    // Fetching Lottie animations
    const fetchLottieAnimations = async () => {
        try {
            console.log("hi")
            const response = await axios.get(`https://api.lottiefiles.com/v2/search?q=${lottieQuery}&limit=10`, {
                headers: {
                    'Authorization': `Bearer ${lottieFilesApiKey}`
                }
            });
            console.log(response)
            setLottieAnimations(response.data.data);
        } catch (error) {
            console.error('Error fetching Lottie animations:', error);
        }
    };

    // Fetching soundtracks
    const fetchSoundtracks = async () => {
        try {
            const response = await axios.get(`https://api.jamendo.com/v3.0/tracks/?client_id=${jamendoClientId}&format=jsonpretty&limit=10&namesearch=${soundtrackQuery}`);
            setSoundtracks(response.data.results);
        } catch (error) {
            console.error('Error fetching soundtracks:', error);
        }
    };



    const dispatch = useDispatch();

    // Feature of double clicking on a video to add it to the previewer
    const addImageToPreviewer = (imagePath) => {
        dispatch(setPreviewerLoadingAction(true));
        
        axios.post('http://127.0.0.1:5001/generate_video', {
            imagePath: imagePath,
            duration: 5
        })
        .then(response => {
            let mediaPath = './Backend/' + response.data;
            dispatch(setPreviewerLoadingAction(false));
            dispatch(previewMediaAction(mediaPath));
            dispatch(setMediaTypeAction('video'));
        })
        .catch(error => {
            console.error('Error generating video:', error);
        });
    };

    // Feature of double clicking on a video to add it to the previewer
    const addVideoToPreviewer = (e, mediaUrl) => {
        e.preventDefault();  // ISSUE !!!! seems to not be working, CANNOT disable double clicking make videos full screen behaviour
        dispatch(previewMediaAction(mediaUrl));
        dispatch(setMediaTypeAction('video'));
    }



    return (
        <div>
            <div className="MediaBox">
                <div className="input-container">
                    <input className="inputbox" type="text" value={imageQuery} onChange={(e) => setImageQuery(e.target.value)} />
                    <button className="button-4 search" onClick={handleSearchImageButtonClick}>Search Images</button>
                </div>

                <br />
                
                <div className="input-container">
                    <input className={`inputbox ${isDark ? 'dark' : ''}`} 
                        type="text" 
                        value={videoQuery} 
                        onChange={(e) => setVideoQuery(e.target.value)} 
                    />

                    <button className={`button-4 search ${isDark ? 'dark' : ''}`} 
                    onClick={handleSearchVideoButtonClick}
                    >
                        Search Videos
                    </button>
                </div>

                <br />

                <div className="input-container">
                    <input className={`inputbox ${isDark ? 'dark' : ''}`} type="text" value={lottieQuery} onChange={(e) => setLottieQuery(e.target.value)} />
                    <button className={`button-4 search ${isDark ? 'dark' : ''}`} onClick={handleSearchLottieAnimationButtonClick}>Search Lottie Animations</button>
                </div>

                <br />

                <div className="input-container">
                    <input className={`inputbox ${isDark ? 'dark' : ''}`} type="text" value={soundtrackQuery} onChange={(e) => setSoundtrackQuery(e.target.value)} />
                    <button className={`button-4 search ${isDark ? 'dark' : ''}`} onClick={handleSongsButtonClick}>Search Soundtrack</button>
                </div>

                <br />

            </div>



            <div className={visibleGrid === 'imageGrid' ? 'imageGrid' : 'hidden'}>
                {images.map((image) => (
                    <img key={image.id} src={image.src.medium} alt={image.photographer} className='stockImages' onDoubleClick={() => addImageToPreviewer(image.src.medium)} />
                ))}
            </div>

            <br />

            <div className={visibleGrid === 'videoGrid' ? 'videoGrid' : 'hidden'}>
                {videos.map((video) => (
                    <ReactPlayer
                        key={video.id}
                        url={video.video_files[0].link}
                        controls={true}
                        className='stockVideos'
                        onDoubleClick={(e) => addVideoToPreviewer(e, video.video_files[0].link)}
                    />
                ))}
            </div>

            <br />

            <div className={visibleGrid === 'lottieGrid' ? 'lottieGrid' : 'hidden'}>
                {lottieAnimations.map((animation) => (
                    <div key={animation.id} className="lottieAnimationItem" onClick={() => addLottieAnimationToPreviewer(animation.files.json)}>
                        <Lottie options={{ animationData: animation.files.json, loop: true, autoplay: false }} height={100} width={100} />
                    </div>
                ))}
            </div>

            <br />

            {/* !!! ISSUE need to change css to have all the 10 search results viewable, by perhaps enabling scrolling */}
            <div className="soundtrackGrid">
                {soundtracks.map((soundtrack) => (
                    <div key={soundtrack.id} className="soundtrackItem">
                        <audio controls>
                            <source src={soundtrack.audio} type="audio/mpeg" />
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default StockMediaBox;
