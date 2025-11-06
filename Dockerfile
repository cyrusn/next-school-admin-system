FROM node:24-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./
COPY jsconfig.json ./
COPY .env.production ./
COPY .env.key.json ./

# Install dependencies
RUN npm install
RUN mkdir -p /app/uploads

# Copy the rest of your application code from the src folder
COPY src ./src
COPY next.config.mjs ./

# Build the Next.js application
RUN npm run build

# Expose the port on which your app will run
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]
