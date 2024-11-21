# Build the React App
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project to the container
COPY . .

# Build the React application
RUN npm run build

# Expose port 3000 to serve the app
EXPOSE 3000

# Run the app
CMD ["npm", "run", "dev"]
