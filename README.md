# Swisscom Service Management - Angular Frontend

This project is the Angular frontend for the Swisscom Service CRUD application. It allows users to manage Services, and their nested Resources and Owners.

## Prerequisites

Before you begin, ensure you have the following installed:
* **Node.js and npm:** Node.js version 18.x or 20.x is recommended. npm is included with Node.js. You can download it from [nodejs.org](https://nodejs.org/).
* **Angular CLI:** Install it globally if you haven't already:
    ```bash
    npm install -g @angular/cli
    ```
* **Starting Spring Boot API:** This frontend application requires the companion Spring Boot backend to be running and accessible.
    * **Backend Repository:** [Swisscom Spring Boot Backend](https://github.com/alekspetrovv/swisscom-java)
    * **Setup Instructions:** Please refer to the `README.md` file within the backend repository for detailed instructions on how to set up and run the backend application.
    * By default, this frontend expects the backend to be available at `http://localhost:4005` (as per `proxy.conf.json`). Ensure the backend is running on the port the proxy is configured to target.

## Setup and Installation

1.  **Clone the repository** (if you haven't already):
    ```bash
    git clone <your-angular-frontend-repo-url>
    cd <your-angular-frontend-project-directory>
    ```

2.  **Install dependencies:**
    Navigate to the project directory and run:
    ```bash
    npm install
    ```
    (If you prefer yarn: `yarn install`)

## Configuration

### API Backend URL

The frontend is configured to connect to the backend API via a proxy to avoid CORS issues during local development.
* The base API URL used by the Angular `ApiService` is `/api`.
* This path is proxied to `http://localhost:4005` (your Spring Boot backend) using the `proxy.conf.json` file located in the root of this Angular project.

  **`proxy.conf.json`:**
    ```json
    {
      "/api": {
        "target": "http://localhost:4005",
        "secure": false,
        "changeOrigin": true
      }
    }
    ```
* This proxy configuration is automatically used when you run `ng serve` because it should be referenced in your `angular.json` file under `projects -> [your-project-name] -> architect -> serve -> options -> proxyConfig`.

If your backend runs on a different port or host, you'll need to update the `target` in `proxy.conf.json`.

### Environment Files
* `src/environments/environment.ts`: For general development settings (uses the proxy).
* `src/environments/environment.prod.ts`: For production builds, you would typically set the full backend API URL here.

## Running the Application (Development Mode)

1.  **Ensure the Spring Boot backend application is running.**
2.  **Start the Angular development server:**
    From the root of the Angular project directory, run:
    ```bash
    ng serve -o
    ```
    * The `-o` flag will automatically open your default web browser to `http://localhost:4200/`.
    * The application will automatically reload if you change any of the source files.

Alternatively, you can use the provided bash script:
```bash
./run-frontend.sh
```
(Make sure the script is executable: `chmod +x run-frontend.sh`)

## Building for Production

To create a production build:
```bash
ng build --configuration production