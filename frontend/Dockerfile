# Step 1: Build React app
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --silent
COPY . .
RUN npm run build

# Step 2: Serve with Nginx
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Optional start script (can be skipped if just running Nginx)
# COPY start.sh /start.sh
# RUN chmod +x /start.sh

EXPOSE 80

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
