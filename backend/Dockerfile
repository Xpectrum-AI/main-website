FROM node:20-alpine

WORKDIR /app

# Install curl for healthcheck
RUN apk add --no-cache curl

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Create .env file from environment variables
RUN touch .env

EXPOSE 5001

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5001/api/test-aws || exit 1

CMD ["npm", "start"]
