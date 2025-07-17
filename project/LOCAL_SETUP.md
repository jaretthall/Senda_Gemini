# Local Development Setup Guide

## 🚀 Quick Start (In Bolt)

Since Git is not available in the Bolt environment, let's focus on getting the app running locally first.

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
You need to create a `.env.local` file with your Supabase credentials:

```bash
# Copy the example file (this creates the file structure)
cp .env.local.example .env.local
```

Then edit `.env.local` with your actual values:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_secret_here
```

### 3. Generate NextAuth Secret
```bash
# Generate a secure secret for NextAuth
openssl rand -base64 32
```
Copy this output and use it as your `NEXTAUTH_SECRET` value.

### 4. Start Development Server
```bash
npm run dev
```

Your app will be available at: http://localhost:3000

## 🔧 Available Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 📁 Download Project for Local Development

To work with Git and push to GitHub, you'll need to:

1. **Download the project files** from Bolt
2. **Set up Git on your local machine**
3. **Push to GitHub from your local environment**

### Steps for Local Git Setup:

1. Download all project files from Bolt to your local machine
2. Open terminal on your local machine in the project directory
3. Run these commands:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Senda Behavioral Health Dashboard"

# Add GitHub remote (create repo on GitHub first)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## 🌐 GitHub Repository Setup

1. Go to [GitHub.com](https://github.com)
2. Click "+" → "New repository"
3. Name: `senda-behavioral-health-dashboard`
4. Choose "Private" (recommended for healthcare apps)
5. Don't initialize with README (we have files already)
6. Create repository
7. Use the remote URL in the git commands above

## 🚀 Vercel Deployment (After GitHub Setup)

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Import your repository
4. Add environment variables in Vercel dashboard
5. Deploy automatically

## 🔍 Troubleshooting

- **Environment variables not working**: Restart dev server after changes
- **Supabase connection errors**: Check credentials in Supabase dashboard
- **Build errors**: Run `npm run build` locally first
- **Port already in use**: Use `npm run dev -- -p 3001` for different port

## 📋 Next Steps

1. ✅ Install dependencies (`npm install`)
2. ✅ Set up environment variables (`.env.local`)
3. ✅ Start development server (`npm run dev`)
4. ⏳ Download project for local Git setup
5. ⏳ Push to GitHub from local machine
6. ⏳ Deploy to Vercel