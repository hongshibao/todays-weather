FROM node:18-bullseye-slim as build

WORKDIR /app

COPY package*.json ./

RUN npm install

# Copy the entire application code to the container
COPY . .

# Build the React app for production
RUN npm run build


# Use Nginx as the production server
FROM nginx:alpine

# Copy the built React app to Nginx's web server directory
COPY --from=build /app/dist /usr/share/nginx/html/ui

# Expose port 80 for the Nginx server
EXPOSE 80

# Start Nginx when the container runs
CMD ["nginx", "-g", "daemon off;"]
