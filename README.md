This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Environment Variables

To connect to the live backend, configure the following environment variable:

```bash
NEXT_PUBLIC_API_URL=https://pgonline-backend-v-1-0.onrender.com/api/v1
```

> **Note:** The application automatically handles URLs with or without trailing slashes and with or without the `/api/v1` path (e.g. `https://pgonline-backend-v-1-0.onrender.com/` will automatically resolve correctly).

## Deploy to Vercel

### Option 1: Via Vercel Dashboard (Recommended)

1. Push your code to your GitHub repository:
   ```bash
   git add .
   git commit -m "feat: prepare user-frontend for vercel deployment"
   git push origin main
   ```
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import the repository: **`pginfo-online/PGONLINE-USER-FRONTEND-V-1.0-`**.
4. In the **Configure Project** screen:
   - **Framework Preset**: Next.js (automatically detected)
   - **Root Directory**: `./`
   - **Build Command**: `next build` (default)
   - **Output Directory**: `.next` (default)
5. Under **Environment Variables**, add:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://pgonline-backend-v-1-0.onrender.com/api/v1`
6. Click **Deploy**.

### Option 2: Via Vercel CLI

```bash
npm i -g vercel
vercel
```
Follow the interactive prompts and supply `NEXT_PUBLIC_API_URL=https://pgonline-backend-v-1-0.onrender.com/api/v1`.

