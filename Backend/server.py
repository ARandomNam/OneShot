from flask import Flask, request
from flask_cors import CORS
import subprocess

app = Flask(__name__)
CORS(app)

def generate_video_from_image(image_path, duration):
    try:
        subprocess.run([
            'ffmpeg', '-loop', '1', '-i', image_path,
            '-c:v', 'libx264', '-t', str(duration), 'output.mp4'
        ])
        return 'output.mp4'
    except Exception as e:
        print('Error generating video:', e)
        return None

@app.route('/generate_video', methods=['POST'])
def handle_generate_video():
    data = request.get_json()
    image_path = data.get('imagePath')
    duration = data.get('duration')
    if not image_path or not duration:
        return 'Missing imagePath or duration', 400

    video_path = generate_video_from_image(image_path, duration)
    if video_path:
        return video_path
    else:
        return 'Failed to generate video', 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)
