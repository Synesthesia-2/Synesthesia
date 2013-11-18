#Synesthesia

Synesthesia is a sound and movement visualizer developed as a collaboration between Kine-Tech, an arts and technology collective, and Hack Reactor, an immersive software engineering academy. It was first performed in public on November 17, 2013, at The Garage in San Francisco.

Synesthesia mixes motion input from mobile devices and audio input during a vocal performance to create visualizations in a web browser that can be projected on stage. A tablet device or laptop computer acts in real time to control which client phones drive the light or motion.


##Instructions:

Requirements: Node.js, npm (Node.js package manager)

To run on your own network:
  - `git clone https://github.com/kinetech/Performance`
  - Install node, if necessary, and install dependencies via `npm install`
  - `node app.js`

Once you are running the server, navigate to `localhost:8080/conductor` in a touch-enabled device. Audience members should connect their smartphones to the `/` endpoint. On the laptop that is running the visualization, connect to `/fireworks` and a projector. In a separate tab, navigate to `/audio` and allow microphone input through the dialog. The movement performer should carry or wear a phone connected to `/dancer`.

The conductor endpoint can now control the show. After enabling audio input, the internal or external microphone will calibrate to compensate for ambient noise for 5-6 seconds and then begin emitting data for the fireworks visualization to render. Manual light show mode will fade through different screen colors on each audience member's phone, allowing the space to be lit according to the pitch of the vocals or to a manually chosen single color. When motion is enabled, the gyroscope data from the `/dancer` endpoint is streamed to the visualization, allowing the firework to move with the performer in space. 

##Screenshots:

Client home screen

![Client home screen](/screenshots/clientHomeScreen.png "Client home screen")

Conductor home screen

![Conductor home screen](/screenshots/conductorScreen.png "Conductor home screen")

Fireworks visualization

![Fireworks visualization](/screenshots/fireworks.png "Fireworks display with audio and phone motion")

##Technology:

Server:
  - Node.js
  - Express.js
  - Socket.io

Client:
  - Jade / Stylus
  - jQuery
  - Backbone.js

Input:
  - Webaudio
  - Phone gyroscope / accelerometer

Output:
  - WebGL

Unit Testing:
  - Mocha
  - PhantomJS

##License:

The MIT License (MIT)

Copyright (c) 2013 Weidong Yang, George Bonner, David Ryan Hall, Kate Jenkins, Joey Yang

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
