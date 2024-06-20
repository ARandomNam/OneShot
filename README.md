# OneShot
 
# Getting Started
1. Run ``` npm install ```
2. Run ``` npm run dev ```
3. (You may have to add ``` sudo ``` in front of all the commend listed above if you are using mac)

# Using APIs Within OneShot
1. Create an ``` .env ``` file in the OneShot Directory
2. Put in ``` VITE_PEXELS_API_KEY = 'YOUR_PEXELS_API_KEY_HERE' ``` (Create the API Key from the Pexels website)
3. Put in ``` VITE_JAMENDO_CLIENT_ID = 'YOUR_JAMENDO_CLIENT_ID_HERE' ``` (Create the API Key from the Jamendo website)

# Work to be done
- [ ] 1. There are several issues commented with ``` !!! ISSUE ``` that have to be resolved
- [ ] 2. Adding an export button on the upper right corner (left to the light/dark theme button) for the function of exporting the video made in the timeline editor
- [ ] 3. Adding the functionality of trimming video (Use ffmpeg in Python in the backend)
- [ ] 4. Adding the functionality of double clicking on a stock soundtrack to add it into the timelineEditor
- [ ] 5. Enable dragging to also be used to drag stock media into the timelineEditor
- [ ] 6. Need to figure out if lottie animation would be used in OneShot
- [ ] 7. Addition to the previewer dropbox, add another button with the same function for importing media
- [ ] 8. Make the previewer dropbox support photos too

# Examples
In src/redux/timelineReducer.js, uncommenting the timelineData can show some examples of media files being displayed in OneShot
