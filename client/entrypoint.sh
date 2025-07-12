#!/bin/sh
set -e

# Replace placeholders in nginx config
envsubst '${SERVER_HOST} ${SERVER_PORT}' < /etc/nginx/nginx.template.conf > /etc/nginx/conf.d/default.conf

# Replace placeholders in built React JS files
find /usr/share/nginx/html/assets -type f -name '*.js' -exec \
  sed -i \
    -e "s|__VITE_API_URL__|${VITE_API_URL}|g" \
    -e "s|__VITE_CLERK_PUBLISHABLE_KEY__|${VITE_CLERK_PUBLISHABLE_KEY}|g" \
    {} +

# Start NGINX
nginx -g 'daemon off;'
