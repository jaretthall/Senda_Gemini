# Deployment and Development Guide

## 🚀 GitHub Setup

### 1. Create GitHub Repository
1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon → "New repository"
3. Name: `senda-behavioral-health-dashboard`
4. Description: "Behavioral Health Management System"
5. Choose "Private" (recommended for healthcare apps)
6. **Don't** initialize with README (we already have files)
7. Click "Create repository"

### 2. Push to GitHub
```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Senda Behavioral Health Dashboard"

# Add GitHub remote (replace with your username/repo)
git remote add origin https://github.com/YOUR_USERNAME/senda-behavioral-health-dashboard.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 3. Future Updates
```bash
# Make your changes, then:
git add .
git commit -m "Description of your changes"
git push origin main
```

## 💻 Local Development Setup

### 1. Environment Variables
```bash
# Copy the example file
cp .env.local.example .env.local

# Edit .env.local with your actual Supabase credentials
# Get these from your Supabase project dashboard
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

Your app will be available at: http://localhost:3000

### 4. Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🔧 Development Workflow

### Daily Development
1. Pull latest changes: `git pull origin main`
2. Start dev server: `npm run dev`
3. Make your changes
4. Test locally
5. Commit and push: 
   ```bash
   git add .
   git commit -m "Your change description"
   git push origin main
   ```

### Environment Variables You Need
- `NEXT_PUBLIC_SUPABASE_URL`: From Supabase Project Settings → API
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: From Supabase Project Settings → API  
- `SUPABASE_SERVICE_ROLE_KEY`: From Supabase Project Settings → API
- `NEXTAUTH_URL`: http://localhost:3000 (for local dev)
- `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`

## 🚀 Vercel Deployment

### 1. Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/in with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Next.js settings

### 2. Environment Variables in Vercel
1. In Vercel dashboard → Project Settings → Environment Variables
2. Add all variables from your `.env.local`
3. **Important**: Update `NEXTAUTH_URL` to your Vercel URL

### 3. Automatic Deployments
- Every push to `main` branch will auto-deploy
- Preview deployments for pull requests
- Instant rollbacks if needed

## 🔍 Troubleshooting

### Common Issues
1. **Environment variables not working**: Restart dev server after changes
2. **Supabase connection errors**: Check your credentials in Supabase dashboard
3. **Build errors**: Run `npm run build` locally to test
4. **Git authentication**: Use personal access token instead of password

### Debug Panel
- Available in development mode (🐛 Debug button)
- Check environment variables, API connections, logs
- Export logs for troubleshooting

## 📁 Project Structure
```
src/
├── app/                 # Next.js app router pages
├── components/          # React components
├── lib/                 # Utilities and configurations
├── hooks/               # Custom React hooks
├── providers/           # Context providers
├── types/               # TypeScript definitions
└── data/                # Sample data files

supabase/
└── migrations/          # Database schema files
```

## 🔒 Security Notes
- ✅ `.env.local` is in `.gitignore` (credentials protected)
- ✅ Use private repositories for healthcare apps
- ⚠️ Never commit real patient data
- ⚠️ Review environment variables before deployment