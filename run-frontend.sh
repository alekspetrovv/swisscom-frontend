#!/bin/bash

echo "====================================================="
echo " Swisscom Service Management - Angular Frontend      "
echo "====================================================="
echo ""

# Check for Node.js and npm (common prerequisites for Angular)
echo "Checking for Node.js and npm..."
if ! command -v node > /dev/null || ! command -v npm > /dev/null; then
  echo "ERROR: Node.js and/or npm are not installed."
  echo "Please install Node.js (which includes npm) to continue."
  echo "You can download it from https://nodejs.org/"
  exit 1
fi
echo "Node.js and npm found."
echo ""

# Check for Angular CLI (ng command)
echo "Checking for Angular CLI (ng command)..."
if ! command -v ng > /dev/null; then
  echo "WARNING: Angular CLI (ng) does not seem to be installed globally or is not in your PATH."
  echo "If 'ng serve' fails, please install Angular CLI globally: npm install -g @angular/cli"
  echo ""
fi

echo "Attempting to install project dependencies (npm install)..."
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: 'npm install' failed. Please check for errors above."
    echo "Ensure you are in the root directory of the Angular frontend project."
    exit 1
fi
echo "Dependencies checked/installed successfully."
echo ""

echo "Starting Angular development server..."
echo "The application will be available at http://localhost:4200/ (this may open in your browser)."
echo "Ensure your Spring Boot backend is running (typically on http://localhost:8080) for API calls."
echo "Press Ctrl+C to stop the Angular server when you are done."
echo ""

# Run ng serve and open the browser
# The -o flag opens it in your default browser.
ng serve -o

# Check the exit code of ng serve
if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: 'ng serve' failed to start or was terminated with an error."
    echo "Please check the output above for any error messages from the Angular CLI."
    exit 1
fi

echo ""
echo "Angular development server stopped by user."