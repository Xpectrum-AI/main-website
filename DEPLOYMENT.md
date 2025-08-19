# Netlify Deployment Guide

## Overview
This project is configured for deployment on Netlify with the following setup:

- **Framework**: React + Vite
- **Package Manager**: npm
- **Build Command**: `npm ci && npm run build`
- **Publish Directory**: `dist`
- **Node Version**: 20

## Configuration Files

### netlify.toml
The main configuration file that tells Netlify how to build and deploy the project:
- Build command and publish directory
- Environment variables
- Redirects for SPA routing
- Security headers and caching rules

### Build Process
The build process is handled directly by Netlify:
- Uses `npm ci` for clean dependency installation
- Runs `npm run build` to build the application
- Outputs files to the `dist` directory

## Environment Variables

The following environment variables are configured in `netlify.toml`:

- `NODE_ENV`: Set to "production"
- `VITE_API_URL`: Set to "/api" for relative API calls
- `VITE_WS_URL`: Set to "wss://xpectrum-ai.com/api/ws/audio"

## Deployment Process

1. **Repository Setup**: Ensure all files are committed to the repository
2. **Netlify Configuration**: The `netlify.toml` file automatically configures the build
3. **Build Process**: 
   - Installs dependencies using `npm ci`
   - Builds the application using `npm run build`
   - Outputs files to the `dist` directory
4. **Deployment**: Netlify serves the built files from the `dist` directory

## Troubleshooting

### Common Issues

1. **Cache Issues**: If you encounter cache-related problems:
   - Clear Netlify cache in the site settings
   - Ensure `package-lock.json` is committed
   - Remove any conflicting lock files (pnpm-lock.yaml, yarn.lock)

2. **Build Failures**: If the build fails:
   - Check the build logs in Netlify dashboard
   - Ensure all dependencies are in `package.json`
   - Verify Node.js version compatibility

3. **Environment Variables**: If environment variables are not working:
   - Check that they are properly set in `netlify.toml`
   - Ensure they start with `VITE_` for client-side access
   - Verify they are not in `.gitignore`

### Local Testing

To test the build locally:

```bash
# Install dependencies
npm ci

# Build the project
npm run build

# Preview the build
npm run preview
```

## File Structure

```
├── netlify.toml          # Netlify configuration
├── package.json          # Dependencies and scripts
├── package-lock.json     # npm lock file
├── .nvmrc               # Node version specification
├── vite.config.ts       # Vite configuration
└── dist/                # Build output (generated)
```

## Notes

- The `dist/` directory is generated during build and should not be committed
- All dependencies are properly specified in `package.json`
- The build process uses `npm ci` for reproducible builds
- SPA routing is configured with redirects to `index.html`
