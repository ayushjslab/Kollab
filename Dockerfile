# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the project
COPY . .

# Build the Next.js app
RUN npm run build

# Expose port 3000 (Next.js default)
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
