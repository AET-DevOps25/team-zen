#!/bin/sh
set -e

# Replace placeholders in nginx config
envsubst '${SERVER_HOST} ${SERVER_PORT}' < /etc/nginx/nginx.template.conf > /etc/nginx/conf.d/default.conf

# Start NGINX
nginx -g 'daemon off;'
