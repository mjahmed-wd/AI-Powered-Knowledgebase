# Frontend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (use npm ci for faster, reliable builds)
RUN npm ci

# Copy source code
COPY . .

# Expose port
EXPOSE 3000
RUN npm run build

# Start the application in development mode
CMD ["npm", "run", "start"]
