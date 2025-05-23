# Rock Paper Scissors with Gestures 👋✊✌️

A browser-based game that uses your webcam and TensorFlow.js to play Rock Paper Scissors with hand gestures.

![Game Screenshot](screenshot.png) *(optional: add screenshot later)*

## Features ✨

- 🎥 Real-time webcam gesture recognition
- 🤖 AI opponent with random moves
- ✊✋✌️ Detects Rock, Paper, and Scissors gestures
- 📊 Tracks wins, losses, and ties
- ⚡ Pure client-side - no backend required
- 📱 Responsive design works on desktop and mobile

## How It Works 🛠️

1. Uses TensorFlow.js with HandPose or PoseNet model
2. Analyzes hand positions from webcam feed
3. Classifies gestures into Rock/Paper/Scissors
4. Compares against AI's move
5. Updates score and displays results

## Setup and Installation 🚀

No installation needed! Just open `index.html` in a modern browser.

### For Development:

1. Clone this repository:
   ```bash
   git clone https://github.com/anshumeshsaini/Neural-Combat.git


   Open index.html in your browser

Grant camera permissions when prompted

Requirements:
Modern browser (Chrome, Firefox, Edge) with WebGL support

Webcam

Internet connection (to load TensorFlow.js models)

How to Play 🎮
Click "Start Camera" and allow camera access

Wait for the model to load (may take a moment)

When prompted, show your gesture:

✊ Rock: Closed fist

✋ Paper: Open hand

✌️ Scissors: Victory sign (two fingers)

The AI will make its move

See who wins and track your score!

Click "Play Again" for another round

File Structure 📂
/
├── src    # Main application file
├── index.css   # Stylesheet
├── index.tsx         # Main game logic
├── ui/component            # (Optional) Folder for images/icons
├── README.md           # This file
Technologies Used 💻
TensorFlow.js

HandPose or PoseNet model

Vanilla JavaScript

Webcam api

CSS3 for styling

Troubleshooting 🛠️
Camera not working:

Ensure you've granted camera permissions

Check if another app is using your camera

Try refreshing the page

Model not loading:

Check your internet connection

Try a different browser

Clear cache and reload

Gesture not recognized:

Make sure your hand is well-lit and visible

Try moving closer to/farther from camera

Hold your gesture clearly and steadily

Future Improvements 🔮
Add more gesture variations

Implement game history

Add difficulty levels for AI

Multiplayer mode via WebRTC

Offline model caching

Contributing 🤝
Contributions are welcome! Please open an issue or pull request.

License 📄
This project is licensed under the MIT License - see the LICENSE file for details.





