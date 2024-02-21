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

- Dynamic Threshold Visualization: Implement dynamic threshold visualization by highlighting CPU load bars in red when they exceed predefined thresholds. Provide users with the ability to set and adjust these thresholds via input controls.

- Improved User Experience: Enhance the user experience with interactive features like tooltips for chart data points, draggable thresholds, and customizable dashboard layouts.

### Continuous Integration/Continuous Deployment (CI/CD) with Docker:

Integrating CI/CD pipelines ensures automated testing and deployment of the application, enhancing development efficiency and reliability. Docker can be used for containerization, providing a consistent environment across different stages of the pipeline. Here's how we can integrate CI/CD with Docker:

- CI Pipeline: Set up a CI pipeline using tools like Jenkins, GitLab CI, or GitHub Actions. The pipeline should include steps for building Docker images, running tests, and pushing images to a registry.

- Dockerization: Dockerize the application by creating a Dockerfile that defines the application's environment and dependencies.

- Testing: Integrate Cypress for end-to-end testing to ensure the application functions correctly across different environments. Cypress tests can be executed as part of the CI pipeline to catch regressions early.

- Deployment: Define deployment stages in the CI/CD pipeline to deploy the application to various environments automatically after successful testing.

By incorporating CI/CD with Docker, Cypress for testing, WebSocket integration for real-time updates, and additional features for enhanced monitoring, the application will be well-equipped for production use, ensuring scalability, reliability, and a seamless user experience.
