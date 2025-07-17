# Senda - Behavioral Health Management System

A comprehensive behavioral health management dashboard built with Next.js, Supabase, and TypeScript.

## Features

- **Patient Management** - Complete patient demographics and case management
- **Clinical Assessments** - PHQ-9, GAD-7, Edinburgh, and custom screeners
- **Episode Tracking** - Treatment episodes with progress monitoring
- **Crisis Management** - Real-time crisis event tracking and alerts
- **Clinical Notes** - Comprehensive documentation system
- **Dashboard Analytics** - Provider and administrative dashboards
- **Data Import** - CSV import system for existing data migration
- **HIPAA Compliance** - Audit logging and security features

## Run Locally

**Prerequisites:** Node.js 18+, Supabase account

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd senda-behavioral-health-dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Copy `.env.local` and update with your Supabase credentials:
   ```bash
   cp .env.local .env.local.example
   ```
   
   Update the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret
   ```

4. **Set up the database:**
   - Create a new Supabase project
   - Run the migration files in `supabase/migrations/` in order
   - Or use the Supabase CLI: `supabase db push`

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Access the application:**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Setup

The application uses Supabase with the following main tables:
- `users` - System users (providers, admins)
- `patients` - Patient demographics and information
- `episodes` - Treatment episodes/interactions
- `assessments` - Clinical screeners and assessments
- `appointments` - Scheduled appointments
- `crisis_events` - Crisis tracking and management
- `notes` - Clinical documentation
- `audit_logs` - HIPAA compliance logging

## Data Import

The system includes CSV import functionality for migrating existing data:
- Patient demographics
- Clinical interactions/episodes
- Assessment scores
- Clinical notes
- ICD-10 diagnosis codes

## Development

### Tech Stack
- **Frontend:** Next.js 14, React 18, TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Authentication:** NextAuth.js
- **Icons:** Heroicons

### Project Structure
```
src/
├── app/                 # Next.js app router
├── components/          # React components
├── lib/                 # Utilities and configurations
├── hooks/               # Custom React hooks
├── providers/           # Context providers
├── types/               # TypeScript type definitions
└── data/                # Sample data and imports
```

### Debug Panel

In development mode, access the debug panel (🐛 Debug button) for:
- Application logs
- Environment variable validation
- Supabase connection testing
- API endpoint testing

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
1. Build the application: `npm run build`
2. Deploy the `out` folder to your hosting provider
3. Ensure environment variables are set in production

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests: `npm run lint`
5. Commit changes: `git commit -m 'Add feature'`
6. Push to branch: `git push origin feature-name`
7. Submit a pull request

## License

This project is proprietary software for behavioral health management.

## Support

For support and questions, contact the development team.

---

**Note:** This application handles sensitive healthcare data. Ensure HIPAA compliance and proper security measures in production environments.