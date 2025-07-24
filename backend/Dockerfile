# Development Dockerfile for Backend
FROM node:18

WORKDIR /app

# Install dockerize for database waiting
RUN apt-get update && apt-get install -y wget \
    && wget https://github.com/jwilder/dockerize/releases/download/v0.6.1/dockerize-linux-amd64-v0.6.1.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-v0.6.1.tar.gz \
    && rm dockerize-linux-amd64-v0.6.1.tar.gz

# Copy package files first for better caching
COPY package*.json ./

# Copy prisma schema BEFORE npm install (needed for postinstall hook)
COPY prisma ./prisma/

# Install dependencies with legacy peer deps to handle version conflicts
RUN npm install --legacy-peer-deps --omit=optional

# Copy tsconfig and source code
COPY tsconfig.json ./
COPY src ./src
COPY start.sh ./

# Make start script executable
RUN chmod +x start.sh

# Expose port
EXPOSE 5000

# Start the application using the script
CMD ["./start.sh"]
