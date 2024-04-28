FROM node:18.17.0-alpine3.17
WORKDIR /app
# Copy the built files and node_modules from the builder stage
COPY dist/apps/portal/.next/standalone ./
COPY dist/apps/portal/public ./apps/portal/public
COPY dist/apps/portal/.next/static ./dist/apps/portal/.next/static
# Set the NODE_ENV environment variable
ENV NODE_ENV production
# Expose the port the app runs on
EXPOSE 3000
CMD ["node", "apps/portal/server.js"]