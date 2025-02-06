#!/bin/bash

# Activate the virtual environment for backend
source backend/src/venv/bin/activate  # Adjusted to the correct path

# Navigate to the backend directory where app.py is located
cd backend/src

# Run the Flask app in the background and save its PID
echo "Starting Backend..."
python app.py &
BACKEND_PID=$!

# Now, navigate to the frontend directory
cd ../../frontend

# Start the frontend (assuming you're using pnpm for the frontend) and save its PID
echo "Starting Frontend..."
pnpm dev &
FRONTEND_PID=$!

# Clean up when the script exits
trap "kill $BACKEND_PID $FRONTEND_PID" EXIT

# Wait for both processes to finish
wait $BACKEND_PID
wait $FRONTEND_PID
