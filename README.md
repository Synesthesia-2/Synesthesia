#Synesthesia

Synesthesia is a sound and movement visualizer developed as a collaboration between Kine-Tech, an arts and technology collective in San Francisco, and Hack Reactor, an immersive software engineering academy in the heart of the city. 

Synesthesia mixes motion input from mobile devices and audio input to create visualizations in a web browser. Multiple devices communicate in real time across a single server.


##Instructions:

Requirements: Node.js, npm (Node.js package manager)

To run on your own network:
  - `git clone https://github.com/kinetech/Performance`
  - Install node, if necessary, and install dependencies via `npm install`

##Screenshots:

Client home screen

![Client home screen](/screenshots/clientHomeScreen.png "Client home screen")

Conductor home screen

![Conductor home screen](/screenshots/conductorScreen.png "Conductor home screen")

Fireworks visualization

![Fireworks visualization](/screenshots/fireworks.png "Fireworks display with audio and phone motion")

Dancer screen

![Dancer screen](/screenshots/dancer.png "Dancer display")


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

<!-- ##Challenges:

Consistency of state:

- Keeping all devices informed about the state of the performance, irrespective of when each device joined the performance, required state-tracking and frequent refreshing of the client list on the server side. 

- Keeping communications fluid and consistent between all endpoints, so an event trigger in one place is known and understood elsewhere became more and more challenging with each feature and endpoint added.

- Setting up file structures to keep 5 endpoints and a server all independent and clearly defined, yet easy to navigate and move between. 

- Keeping the 5 endpoints all cohesive in their code structure, so when swapping quickly between endpoints there was a minimal amount of time needed to reorient the user.


Visualizations:

- Structuring the data being passed around so varied inputs (audio pitch and volume, mouse movements, gyroscope or accelerometer data from phones) such that they could be mapped to the same visualization required calibration of data output by different phone models to provide the same effects.


Inputs:

- Integrating multiple types of input into a cohesive experience. Audio, motion and touch inputs all had to be recognized and used to create the final visualization on the visualizer and the client devices.


Audio input - Pitch detection: 

- Webaudio provides basic Fourier Fast Transforms, but by default they're not very accurate. We designed an algorithm to increase the accuracy of the results, down to 1hz. To maximize reliability, we also implemented methods for automatic thresholding and intelligent noise canceling.


Audio input - Modularity: 

- Since Webaudio is so new, it doesn't have concise methods for creating multiple filters and analysers in non-trivial audio applications. The code to create and set attributes for multiple nodes is long and repetitive. We created a number of helper methods for working with Webaudio, which helped keep the code more organized and efficient.

##Codebase map:

TODO: Map the codebase and provide instructions -->

##License:

The MIT License (MIT)

Copyright (c) 2013 Weidong Yang, George Bonner, David Ryan Hall, Kate Jenkins, Joey Yang

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.






