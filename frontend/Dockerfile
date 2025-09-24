# Use the official Node.js image as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json first for caching dependencies
COPY package*.json /app/

# Install the dependencies (including Vite, React, etc.)
RUN npm install

# Copy the rest of the React source code
COPY . /app/

# Build the React app using Vite
RUN npm run build

# Install a simple HTTP server to serve the built files
RUN npm install -g serve

# Expose the port that the app will be served on
EXPOSE 3000

# Command to serve the built React app
CMD ["serve", "-s", "dist", "-l", "3000"]
