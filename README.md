# OpenNotes - Free Academic Note Sharing Platform

A modern, open-source platform for sharing academic notes, study materials, and educational resources. Built with React, TypeScript, and Supabase.

## 🚀 Features

- **Free Access**: Browse and download notes without registration
- **Verified Content**: All uploads are reviewed by admin team
- **Easy Upload**: Simple upload process for staff members
- **Role-based Access**: Student, Staff, and Admin roles
- **Modern UI**: Beautiful, responsive design with dark/light themes
- **Real-time Updates**: Live notifications and status updates

## 🏗️ Project Structure

```
opennotes-shared-learn/
├── client/                       # Frontend application
│   ├── core/                     # Core app wiring
│   ├── modules/                  # Feature modules
│   │   ├── auth/                 # Authentication
│   │   ├── notes/                # Notes management
│   │   ├── admin/                # Admin panel
│   │   └── home/                 # Home page
│   ├── ui-kit/                   # Design system components
│   ├── shared/                   # Shared utilities and hooks
│   └── layout/                   # App layouts
├── server/                       # Backend & integrations
│   └── supabase/                 # Database and auth
├── config/                       # Configuration files
└── public/                       # Static assets
```

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI**: Tailwind CSS, Radix UI, Lucide Icons
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **State Management**: TanStack Query
- **Forms**: React Hook Form + Zod validation
- **Routing**: React Router v6

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd opennotes-shared-learn
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

Add your Supabase credentials to `.env`:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server
```bash
npm run dev
```

The app will be available at `http://localhost:8080`

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🗄️ Database Setup

The project uses Supabase for database and authentication. Run the migrations in the `server/supabase/migrations/` directory to set up your database schema.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by the need for accessible education
- Community-driven development approach