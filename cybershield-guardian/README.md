# CyberShield Guardian

## Overview

CyberShield Guardian is a full stack cybersecurity platform with 100+ tools, teaching platform, certification, digital signatures, payment integration, and more.

## Deployment

### Frontend Deployment on GitHub Pages

GitHub Pages supports only static sites. You can deploy the frontend part of CyberShield Guardian to GitHub Pages.

1. Make sure you have a `build` script in your frontend `package.json` that builds the production-ready static files into a `build` folder.

2. The project includes a GitHub Actions workflow `.github/workflows/deploy-frontend.yml` that automatically builds and deploys the frontend to GitHub Pages on every push to the `main` branch.

3. To enable GitHub Pages:

   - Go to your GitHub repository settings.
   - Under "Pages", select the branch `gh-pages` (created by the workflow) as the source.
   - Save the settings and your site will be published at `https://<your-username>.github.io/<repository-name>/`.

### Backend Deployment

The backend requires a Node.js environment and MongoDB database. GitHub Pages cannot host backend services.

You can deploy the backend on platforms like:

- Heroku
- Render
- DigitalOcean
- AWS Elastic Beanstalk

Make sure to set environment variables such as `MONGODB_URI`, `JWT_SECRET`, `STRIPE_SECRET_KEY`, etc.

## Running Locally

### Frontend

```bash
cd frontend
npm install
npm run start
```

### Backend

```bash
cd backend
npm install
npm run start
```

## Notes

- The frontend communicates with the backend API via environment-configured URLs.
- For full functionality, backend must be deployed and accessible to the frontend.
- Payment integration requires Stripe API keys.
- Digital signature requires additional setup.

## License

MIT License
