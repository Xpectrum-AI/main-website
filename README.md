# Xpectrum AI

## Docker Deployment Instructions

### Prerequisites
- Docker and Docker Compose installed on your server
- Git (optional, for cloning the repository)

### Deployment Steps

1. Clone or download the repository to your server:
   ```bash
   git clone <repository-url>
   cd main-website
   ```

2. Build and start the Docker container:
   ```bash
   docker-compose up -d
   ```

3. The application should now be running at http://your-server-ip

### Managing the Application

- To stop the application:
  ```bash
  docker-compose down
  ```

- To view logs:
  ```bash
  docker-compose logs -f
  ```

- To rebuild and restart after changes:
  ```bash
  docker-compose up -d --build
  ```

### Environment Configuration

For production deployments with environment variables:

1. Create a `.env` file in the root directory
2. Uncomment and configure the environment section in `docker-compose.yml`

### SSL Configuration

For HTTPS support:

1. Modify the nginx.conf file to include SSL configuration
2. Update the docker-compose.yml to expose port 443
3. Add SSL certificates to the container

### Troubleshooting

- If the application doesn't start, check the logs:
  ```bash
  docker-compose logs
  ```

- To inspect the container:
  ```bash
  docker exec -it xpectrum-app /bin/sh
  ```
