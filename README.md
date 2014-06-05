#Synesthesia v2.0

Synesthesia 2.0 is an interactive, realtime data visualization suite developed at Kinetech in San Francisco.
The application collects, processes, and abstracts audio, orientation, movement, and location data from remote computers and mobile devices and dynamically renders live in-browser displays which can be projected onto a wall, floor, or stage. 
Additionally, a user-friendly control panel page allows for a conductor to enable or disable data transfer from input sources to visualizers and to adjust visualization parameters during a performance while the app is running. 

The modular, plugin-style architecture of v2.0 enables developers and artists to easily integrate new visualizers or data input nodes into the existing framework. 

##Instructions:

Requirements: [Node.js](http://nodejs.org/), npm (Node.js package manager)

To run Synesthesia from the command line on your own network:
  - Make sure that Node.js is installed (Check via `node --version` ) 
  - Determine the IP address of the computer that will be running the node server.
    * _Note: This IP address is referred to below as **serverComputerIPaddress**_
    * On Mac OS:
      * Open System Preferences
      * Click Network under Internet & Wireless
      * Look for the ip address under Status
    * In a UNIX environment, use `ifconfig` 
  - Clone the repo `git clone https://github.com/strixcuriosus/Synesthesia`
  - Open the Synesthesia directory: `cd Synesthesia`
  - Install dependencies: `npm install`
  - Install front end packages: `bower install`
  - Start the server: `node app.js`

Once the server is running, open a browser on a touch-enabled device and navigate to `serverComputerIPaddress:8080/conductor`.


Audience members should connect their smartphones to the `/` endpoint (i.e. `serverComputerIPaddress:8080/` ). 

On the laptop that is running the visualization, connect to `/fireworks` and a projector. In a separate tab, navigate to `/audio` and allow microphone input through the dialog. The movement performer should carry or wear a phone connected to `/dancer`.

The conductor endpoint can now control the show. After enabling audio input, the internal or external microphone will calibrate for 5-6 seconds to implement noise cancelling filters and input thresholding, and then begin emitting data for the fireworks visualization to render. Manual light show mode will fade through different screen colors on each audience member's phone, allowing the space to be lit according to the pitch of the vocals or to a manually chosen single color. When motion is enabled, the gyroscope data from the `/dancer` endpoint is streamed to the visualization, allowing the firework to move with the performer in space. 

## How To Add A New Visualizer: 

##Screenshots:

Client home screen

![Client home screen](/screenshots/clientHomeScreen.png "Client home screen")

Conductor home screen

![Conductor home screen](/screenshots/conductorScreen2.png "Conductor home screen")

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
  - Backbone.js / Handlebars
  - Browserify

Input:
  - Internal Webcam
  - HTML5
  - External Infrared-sensitive Camera
  - Internal Microphone
  - Web Audio API
  - Mobile phone gyroscope / accelerometer

Output:
  - D3.js
  - Pixi.JS
  - WebGL
  - ShaderParticleEngine

Unit Testing:
  - Mocha
  - PhantomJS

## 1.0
This project is based on Synesthesia (v.1.0), an original work by Weidong Yang, George Bonner, David Ryan Hall, Kate Jenkins, and Joey Yang, which was first performed in public on November 17, 2013, at The Garage in San Francisco.

##License:

The MIT License (MIT)

Copyright (c) 2014 Weidong Yang, Kayvon Ghashghai, Ian Henderson, and Ash Hoover

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

