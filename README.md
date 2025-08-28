# EduHub - Academic Resource Hub

A student-run academic hub for organizing and sharing educational resources across fields, semesters, modules, and submodules.

## Features

- **Public Access**: Browse and download resources without authentication
- **Admin Management**: Role-based access control for resource management
- **Hierarchical Organization**: Field → Semester → Module → Submodule → Resource
- **File Upload**: Drag & drop interface with progress tracking
- **Search & Filter**: Global search with advanced filtering options
- **Responsive Design**: Mobile-first design with dark mode support

## Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: NextAuth.js with credentials provider
- **UI**: Tailwind CSS + shadcn/ui components
- **File Storage**: Local filesystem (configurable for cloud storage)
- **Search**: Database search with Meilisearch-ready architecture

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd eduhub
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env
# Edit .env with your database credentials and other settings
\`\`\`

4. Set up the database:
\`\`\`bash
# Push the schema to your database
npm run db:push

# Seed the database with sample data
npm run db:seed
\`\`\`

5. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` to see the application.

## Database Schema

The application uses a hierarchical structure:

- **Field**: Academic field (e.g., "Data Science")
- **Semester**: Exactly 6 semesters per field (1-6)
- **Module**: Course modules within a semester
- **Submodule**: Subdivisions of modules
- **Resource**: Files and materials within submodules

## User Roles

- **Public Users**: Read-only access, no authentication required
- **Class Admin**: Upload/manage resources within assigned field-semester scopes
- **Super Admin**: Full system access and user management

## Default Login Credentials

After running the seed script:

- **Super Admin**: admin@eduhub.com / admin123
- **Class Admin 1**: class1@eduhub.com / class123
- **Class Admin 2**: class2@eduhub.com / class123

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio
- `npm run db:reset` - Reset database (destructive)

## File Upload

Files are stored locally in the `uploads/` directory with the structure:
\`\`\`
uploads/
├── field-slug/
│   ├── S1/
│   │   ├── module-slug/
│   │   │   └── submodule-slug/
│   │   │       └── files...
\`\`\`

## API Endpoints

- `GET /api/search` - Search resources
- `POST /api/upload` - Upload files (admin only)
- `GET /api/files/[id]/download` - Download files

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
