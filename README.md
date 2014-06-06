#Synesthesia v2.0

Synesthesia 2.0 is an interactive, realtime data visualization suite developed at [Kinetech](http://kine-tech.org/) in San Francisco.
The application collects, processes, and abstracts audio, orientation, movement, and location data from remote computers and mobile devices and dynamically renders live in-browser displays which can be projected onto a wall, floor, or stage. 
Additionally, a user-friendly control panel page allows for a conductor to enable/disable data transfer from input sources to visualizers and to adjust visualization parameters during a performance while the app is running.

The current version debuted at the [CODAME Art + Tech Playground](http://www.codame.com/)'s Code + Dance + Hack event on May 31, 2014 at CounterPULSE in San Francsico where the developers were able to collaborate and exchange ideas with dancers, artists, and technologists. 

Architecturally, the modular plugin style of v2.0 enables developers and artists to easily integrate new visualizers or data input nodes into the existing framework. 

##Instructions:
###Run Synesthesia from the command line on your own network:
**Requirements:** [Node.js](http://nodejs.org/), npm (Node.js package manager)
#####Set up the environment:
  * Make sure that Node.js is installed (Verify via `node --version` ) 
  * Determine the IP address of the computer that will be running the node server.
    * _Note:_ This IP address is referred to below as **serverIPaddress**
    * On Mac OS:
      * Open System Preferences
      * Click Network under Internet & Wireless
      * Look for the ip address under Status
    * In any UNIX environment, use `ifconfig` 
  * _Optionally_, set the PORT variable in your shell environment
    * At runtime, if no PORT is specified in the app's environment, the default PORT is 8080

#####Download necessary files:
  * Clone the repo via `git clone https://github.com/strixcuriosus/Synesthesia`
  * Open the Synesthesia directory: `cd Synesthesia`
  * Install application dependencies: `npm install`
  * Install front end packages: `bower install`

#####Start the application:
  * Run the server: `node app.js` 
  * Look for a logged message in the terminal:
   *"Synesthesia server listing on port __[yourPORT]__"
   * __[yourPORT]__ will be `8080` if the runtime environment has no specified PORT
   * In the following sections, you may need to replace `8080` with your actual port value

#####Connect to the control panel page:
  * Keep the server running
  * Open a browser on a touch-enabled device 
    *Note: A touch-emulator such as the one found in Chrome's dev tools panel can be used
  * Navigate to `serverIPaddress:8080/conductor`.


Audience members should connect their smartphones to the `/` endpoint (i.e. `serverIPaddress:8080/` ). 

On the laptop that is running the visualization, connect to `/fireworks` and a projector. In a separate tab, navigate to `/audio` and allow microphone input through the dialog. The movement performer should carry or wear a phone connected to `/dancer`.


The conductor endpoint can now control the show. After enabling audio input, the internal or external microphone will calibrate for 5-6 seconds to implement noise cancelling filters and input thresholding, and then begin emitting data for the fireworks visualization to render. Manual light show mode will fade through different screen colors on each audience member's phone, allowing the space to be lit according to the pitch of the vocals or to a manually chosen single color. When motion is enabled, the gyroscope data from the `/dancer` endpoint is streamed to the visualization, allowing the firework to move with the performer in space. 



## How To Add A New Visualizer: 

Visualizers live in `public/javascript/visualizers`. To add one, create a directory in here with your .js files and a `config.json` file. You can list `inputs`, `extraJS` and `extraStyl` along with any necessary input forms or files as arrays. For example:

    {
      "inputs": ["audio", "opticalFlow", "audienceMotionData"],
      "extraJS": ["helpers.js"],
      "extraStyl": null
    };
 
On startup of the Node server, the directory names in `public/javascript/visualizers` are read and turned into Express.js routes and Socket.io namespaces with the same names. `config.json` files in each directory will also be read and the input sources specified in the `"inputs"` property will be routed to their respective visualizers. Without a config file, your visualizer will not get any data from the input sources so make sure you include one if it's necessary!

To view your visualizer, open a browser with the URL `localhost:8080/file` (replacing `file` with the name of your visualizer). Inputs such as audio or optical flow can be run in another browser window on the same computer, or if the visualizer is particularly CPU-intensive they can all be run on separate machines.


##Screenshots:

Client home screen

![Client home screen](/screenshots/ClientView.png "Client Home Screen")

Conductor home screen

![Conductor home screen](/screenshots/conductorScreen2.png "Conductor Control Panel Page")

Fireworks visualization

![Fireworks visualization](/screenshots/fireworks.png "Fireworks display with audio and phone motion")

Satellite Dance Grid Visualizations

![Calm Satellite Dance Grid Visualization](/screenshots/SatelliteDanceGrid/CalmGrid.png "Dance grid display with thin lines correlating to low acceleration")

![Color Changing Satellite Dance Grid Visualization](/screenshots/SatelliteDanceGrid/ColorChange.png "Dance grid display with color changes corresponding to max frequency of audio input")

![Medium Acceleration Satellite Dance Grid Visualization](/screenshots/SatelliteDanceGrid/RampUpGrid.png "Dance grid display with medium-thick lines correlating to moderate acceleration")

![High Acceleration Satellite Dance Grid Visualization](/screenshots/SatelliteDanceGrid/RampUpGrid2.png "Dance grid display with thick, bold lines correlating to high acceleration")

## Screencast Demos:
=======
Shakemeter visualization

![Shakemeter visualization](/screenshots/shakemeter.png "Shakemeter display from phone motion")

Rain visualization

![Rain visualization](/screenshots/rain.png "Rain display from optical flow data")

Grassfield visualization

![Grassfield visualization](/screenshots/grassfield.png "Grassfield display from optical flow data")


##technology:

server:
  - node.js
  - express.js
  - socket.io

client:
  - jade / stylus
  - jquery
  - backbone.js / handlebars
  - browserify

input:
  - internal webcam
  - html5
  - external infrared-sensitive camera
  - internal microphone
  - web audio api
  - mobile phone gyroscope / accelerometer

output:
  - d3.js
  - pixi.js
  - webgl
  - shaderparticleengine

unit testing:
  - mocha
  - phantomjs

## how to add a new visualizer: 

## potential future directions:

## 1.0
this project is based on synesthesia (v.1.0), an original work by weidong yang, george bonner, david ryan hall, kate jenkins, and joey yang, which was first performed in public on november 17, 2013, at the garage in san francisco.

##license:

the mit license (mit)

copyright (c) 2014 weidong yang, kayvon ghashghai, ian henderson, and ash hoover

permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "software"), to deal in the software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software, and to permit persons to whom the software is furnished to do so, subject to the following conditions:

the above copyright notice and this permission notice shall be included in
all copies or substantial portions of the software.

the software is provided "as is", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. in no event shall the authors or copyright holders be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the software.

