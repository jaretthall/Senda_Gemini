# GitHub Setup Instructions

Follow these steps to push your Senda project to GitHub:

## 1. Create a GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Name your repository (e.g., `senda-behavioral-health-dashboard`)
5. Add a description: "Behavioral Health Management System"
6. Choose "Private" (recommended for healthcare applications)
7. **DO NOT** initialize with README, .gitignore, or license (we already have these)
8. Click "Create repository"

## 2. Initialize Git in Your Project

Open your terminal in the project directory and run:

```bash
# Initialize git repository
git init

# Add all files to staging
git add .

# Create initial commit
git commit -m "Initial commit: Senda Behavioral Health Dashboard"

# Add your GitHub repository as remote origin
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## 3. Environment Variables Security

**IMPORTANT:** Your `.env.local` file is already in `.gitignore` and won't be pushed to GitHub. This protects your sensitive Supabase keys.

### For Team Members:
1. Share the `.env.local.example` file (which has placeholder values)
2. Each team member should copy it to `.env.local` and add their own keys
3. Never commit actual API keys to the repository

## 4. Supabase Setup for Team

Each team member will need to:

1. **Create their own Supabase project** OR **share the same project**
2. **Run the migrations:**
   ```bash
   # If using Supabase CLI
   supabase db push
   
   # Or manually run the SQL files in order:
   # - supabase/migrations/20250714184127_long_peak.sql
   # - supabase/migrations/20250714184200_aged_tower.sql
   ```

## 5. Recommended GitHub Workflow

### Branch Protection (Optional but Recommended):
1. Go to your repository on GitHub
2. Click "Settings" → "Branches"
3. Add rule for `main` branch
4. Enable "Require pull request reviews before merging"

### Development Workflow:
```bash
# Create feature branch
git checkout -b feature/patient-import

# Make changes and commit
git add .
git commit -m "Add CSV patient import functionality"

# Push feature branch
git push origin feature/patient-import

# Create Pull Request on GitHub
# After review and approval, merge to main
```

## 6. Deployment Options

### Option A: Vercel (Recommended)
1. Connect your GitHub repo to Vercel
2. Add environment variables in Vercel dashboard
3. Auto-deploy on push to main

### Option B: Netlify
1. Connect GitHub repo to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `out`
4. Add environment variables

## 7. Team Collaboration

### For New Team Members:
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
cd senda-behavioral-health-dashboard

# Install dependencies
npm install

# Copy environment template
cp .env.local.example .env.local

# Add your Supabase credentials to .env.local
# Run the application
npm run dev
```

## 8. Important Security Notes

- ✅ `.env.local` is in `.gitignore` (API keys protected)
- ✅ `node_modules` is in `.gitignore`
- ✅ `.next` build files are ignored
- ⚠️ **Never commit real patient data to GitHub**
- ⚠️ **Use private repositories for healthcare applications**
- ⚠️ **Review all commits before pushing**

## 9. Troubleshooting

### If you get authentication errors:
```bash
# Use personal access token instead of password
# Go to GitHub Settings → Developer settings → Personal access tokens
# Generate new token with repo permissions
# Use token as password when prompted
```

### If you need to change remote URL:
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_NEW_REPO_NAME.git
```

---

**Ready to push to GitHub!** Run the commands in step 2 to get started.