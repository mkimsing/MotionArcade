# MotionArcade
Full-stack React app featuring games controlled via hand gestures in front of a webcam

### Overview
Two-week project built from scratch as the capstone project for the BrainStation Web Development Diploma course. The focus was building a full-stack application to showcase the web frameworks and languages I learned, while also exploring interesting technologies not covered in the program.

### Features
The core of the app is two web games that are controlled via hand gestures and a webcam. 

* The first game is an endless runner style game where the game is controlled by discrete hand gestures (swipe up to jump, swipe right to attack). 

* The second game is a galaga/space invaders style game where the location of the player's hand relative to the webcam video bounding box is continuously mapped to the ship's location relative to the game canvas.
 
Scores from the games are stored in a database and accessed through http requests to my express server to make leaderboards for each of the games. 
Everything is then embedded in a modern, single page React-app.

### Technologies
* The games are built in **[Phaser 3](https://phaser.io/phaser3)**, an open source framework for building HTML5 games (development done in *JavaScript*) using open source assets.

* Hand tracking is performed using **[handtrackjs](https://www.npmjs.com/package/handtrackjs)**, an library for realtime hand-detection. This takes a video stream (from a webcam) and outputs predictions for hands in each frame. 

* The front-end is a **[React](https://reactjs.org/)** single page app, styled using **[SCSS](https://sass-lang.com/)** and stylesheets. Also uses the **[react-router](https://www.npmjs.com/package/react-router)** library for navigation and **[axios](https://www.npmjs.com/package/axios)** for HTTP requests.

* Back-end is a **Node / [Express](https://www.npmjs.com/package/express)** server with multiple endpoints serving scores/leader-board data from a **[MySQL](https://www.mysql.com/)** database.
