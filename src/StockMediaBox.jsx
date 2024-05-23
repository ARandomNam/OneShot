import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import axios from 'axios';
import './css/StockMediaBox.css';
import { useDispatch } from 'react-redux';
import { previewMediaAction, setPreviewerLoadingAction } from './redux/actions.js';

const StockMediaBox = ({ isDark }) => {
    
    const [imageQuery, setImageQuery] = useState('');
    const [videoQuery, setVideoQuery] = useState('');
    const [images, setImages] = useState([]);
    const [videos, setVideos] = useState([]);
    const [visibleGrid, setVisibleGrid] = useState('none');
    // PEXELS API Key
    const apiKey = import.meta.env.VITE_PEXELS_API_KEY;

    const handleButtonClick = () => {
        setVisibleGrid('imageGrid');
        fetchImages();
    };
    const handleButtonClick2 = () => {
        setVisibleGrid('videoGrid');
        fetchVideos();
    };


    // Fetching Stock images
    const fetchImages = async () => {
        try {
            const response = await axios.get(`https://api.pexels.com/v1/search?query=${imageQuery}&per_page=10`, {
                headers: {
                    Authorization: apiKey,
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
                    Authorization: apiKey,
                },
            });
            setVideos(response.data.videos);
        } catch (error) {
            console.error('Error fetching videos:', error);
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
        })
        .catch(error => {
            console.error('Error generating video:', error);
        });
    };

    // Feature of double clicking on a video to add it to the previewer
    const addVideoToPreviewer = (e, mediaUrl) => {
        e.preventDefault();  // !!!!!!!!!!!!!! seems to not be working, CANNOT disable double clicking make videos full screen behaviour
        dispatch(previewMediaAction(mediaUrl));
    }



    return (
        <div>
            <div className="MediaBox">
                <div className="input-container">
                    <input className="inputbox" type="text" value={imageQuery} onChange={(e) => setImageQuery(e.target.value)} />
                    <button className="button-4 search" onClick={handleButtonClick}>Search Images</button>
                </div>
                <br />
                <div className="input-container">
                    <input className={`inputbox ${isDark ? 'dark' : ''}`} 
                        type="text" 
                        value={videoQuery} 
                        onChange={(e) => setVideoQuery(e.target.value)} 
                    />

                    <button className={`button-4 search ${isDark ? 'dark' : ''}`} 
                    onClick={handleButtonClick2}
                    >
                        Search Videos
                    </button>
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
        </div>
    );
};

export default StockMediaBox;
