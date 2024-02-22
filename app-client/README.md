# CPU load average web application

This project is a proof-of-concept (POC) for a browser-based CPU load monitoring application. The application allows users to view CPU load information in real-time, analyze historical data and receive alerts for high CPU load or recovery.

## Available features

- Real-time CPU Load Monitoring: Display current average CPU load.
- Historical Data Visualization: Track CPU load changes over a 10-minute window.
- Alerting System: Alert users to high CPU load or recovery events.
- Backend Service Integration: Communicate with a local backend service to retrieve CPU load information.
- Periodic Data Retrieval: Retrieve CPU load information every 10 seconds.
- Threshold-based Alerts: Alert users when CPU load exceeds or recovers from predefined thresholds.

## Used technologies

- Frontend: React.js, TypeScript, CSS
- Backend: Node.js, Express.js
- Testing: Jest, React testing library

## Setup instructions

To setup the project you can start by installing the dependencies. To do so you can run at the project root:

```sh
$> npm run setup
```

then, to start the project you can run concurrently the client and server by running at the root of the project:

```sh
$> npm start
```

Open [http://localhost:3000] to view it in the browser.

The utils file methods and the component are tested. Run this command on `app-client` to excecute these tests:

```
$> npm test
```

## Future improvments

### WebSocket Integration:

WebSocket integration enhances real-time communication between the client and server, enabling instant updates without continuous polling. To do it we can modify the client-side code to establish a WebSocket connection with the server upon application initialization. Subscribe to CPU load updates and dynamically update the UI using WebSocket events.

### Additional Features for Enhanced Monitoring:

- Expanded Monitoring Metrics: Extend monitoring capabilities by measuring additional computer metrics, such as memory usage, disk I/O, network traffic, etc. Integrate corresponding charts to visualize these metrics alongside CPU load.

- Dynamic Threshold Visualization: Implement dynamic threshold visualization by highlighting CPU load bars in red when they exceed predefined thresholds. Provide users with the ability to set and adjust these thresholds via input controls or provide a window of visualisation instead of default 10 minutes.

- Improved User Experience: Enhance the user experience with interactive features like tooltips for chart data points, draggable thresholds, and customizable dashboard layouts.

- ...

### Continuous Integration/Continuous Deployment (CI/CD) with Docker:

Integration of CI/CD pipelines to ensure automated testing and deployment of the application, enhance development efficiency and reliability. Docker can be used for containerization, providing a consistent environment across different stages of the pipeline.

By incorporating CI/CD with Docker, Cypress for testing, WebSocket integration for real-time updates, and additional features for enhanced monitoring, the application will be well-equipped for production use, ensuring scalability, reliability, and a seamless user experience.

### Some other planned improvements

- Better handling and logging of catched erros by displaying a costum error to the screen for example

- Enhance data structure to handle bigger amount of data

- Persist historical CPU load data in a database instead of using local storage

- ...
