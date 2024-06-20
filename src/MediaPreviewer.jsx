import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { timelineAddAction } from './redux/actions';
import ReactPlayer from 'react-player';
import { useDropzone } from 'react-dropzone';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { previewMediaAction, setMediaTypeAction } from './redux/actions';



const MediaPreviewer = ({timelineData, timelineAddAction}) => {

    const mediaUrl = useSelector(state => state.mediaPreview.mediaUrl);
    const mediaType = useSelector(state => state.mediaPreview.mediaType);
    const isLoading = useSelector(state => state.mediaPreview.isLoading);

    // useState
    const [durationTimelineData, setDurationTimelineData] = useState(null);


    // For handling video/audio dropbox
    const dispatch = useDispatch();

    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        const url = URL.createObjectURL(file);
        const fileType = file.type.startsWith('video') ? 'video' : 'audio';
        dispatch(setMediaTypeAction(fileType));
        dispatch(previewMediaAction(url));
    };

    const acceptType = 'video/*, audio/*';
    const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: acceptType });


    // Get duration of imported video/audio
    const getDuration = (duration) => {
        const durationInSeconds = duration;
        setDurationTimelineData(durationInSeconds);
    }


    // Add video/audio data to the timelineEditor (use useEffect to automatically add the data once any video/audio is added to the previewer)
    const handleTimelineAddData = (mediaSrc, mediaType) => {
        const id = timelineData.length.toString()

        const newTimelineData = {
            id: id,
            actions: [
                {
                    id: id,
                    start: 0,
                    end: durationTimelineData,
                    effectId: mediaType === 'video' ? 'videoEffect' : 'audioEffect',
                    data: {
                        src: mediaSrc,
                        name: mediaType === 'video' ? 'Video' + id : 'backgroundAudio' + id, 
                    },
                }
            ],
        };
        timelineAddAction(newTimelineData);
    };

    useEffect(() => {
        if (durationTimelineData != null) {
            handleTimelineAddData(mediaUrl, mediaType);
        }
    }, [durationTimelineData]);

    

    return (
        <div>
            <div {...getRootProps()} style={{ border: '2px dashed #ccc', padding: '22px', textAlign: 'center' }}>
                {isLoading ? (
                    <p>loading ... </p>
                ) : (
                    <div>
                        <input {...getInputProps()} />
                        <p>Drag & drop a video or audio file here, or click to select one</p>
                    </div>
                )}
            </div>

            {/* !!! ISSUE Later on have to decide whether to show the video with ReactPlayer or with just the HTML video element */}
            {/* {mediaUrl && mediaType == 'video' && (
                <ReactPlayer
                    url={mediaUrl}
                    controls={true}
                    width="100%"
                    height="auto"
                    onDuration={getDuration}
                />
            )} */}

            {mediaUrl && mediaType === 'video' && (
                <ReactPlayer
                    url={mediaUrl}
                    controls={false}
                    width="0"
                    height="0"
                    style={{ display: 'none' }}
                    onDuration={getDuration}
                />
            )}

            {/* In order to call getDuration even though I don't need the audio component to be rendered, I still create the react player component but set it to be non visible on the UI */}
            {/* !!! ISSUE Due to the component being non visible but users should still be notified once the audio is sucessfully added, later on we should add a UI Special Effect to notify users of that*/}
            {mediaUrl && mediaType === 'audio' && (
                <ReactPlayer
                    url={mediaUrl}
                    controls={false}
                    width="0"
                    height="0"
                    style={{ display: 'none' }}
                    onDuration={getDuration}
                />
            )}
            <div id="video-previewer-element"></div>

            {/* Temporary for the lottie animation */}
            {/* <div id="player-ground-1"></div> */}
        </div>
    )
}



// React Redux Stuff
const mapStateToProps = (state) => ({
    timelineData: state.timeline.timelineData,
});

const mapDispatchToProps = {
    timelineAddAction,
};



export default connect(mapStateToProps, mapDispatchToProps)(MediaPreviewer);