## 🌟 EduHub: An Academic Hub for Students

### 📌 Product Summary
EduHub is a production-ready, student-run web application designed to be a central academic resource hub. It organizes and provides read-only access to a hierarchical structure of academic materials. The hierarchy is strictly defined as **Field → Semester (1-6) → Module → Submodule → Resource**.

* **Public Users (Students)**: Unauthenticated, read-only access to browse and download resources.
* **Admins**: Authenticated users who can manage resources within a specific scope.
* **SuperAdmin**: Full control over all content and admin scopes.

### 💻 Tech Stack
* **Framework**: Next.js 14 with App Router & TypeScript
* **UI**: Tailwind CSS, shadcn/ui, lucide-react
* **State/Server**: Next.js Server Actions & Route Handlers
* **Database**: Supabase (PostgreSQL), with Prisma ORM for non-auth data models.
* **Authentication**: Supabase Auth for admins only.
* **Storage**: Local filesystem (abstracted for future cloud integration like S3 or Supabase Storage).
* **Search**: Simple database search (ILIKE) on `Resource.title`
* **Internationalization**: French-first, with strings centralized for future i18n support.

### 📂 Core Features
* **Hierarchical Navigation**: A left-sidebar for browsing content by **Field → Semester → Module → Submodule**.
* **Resource Management (Admin-Only)**: Admins can upload, edit, and manage resources via a protected dashboard.
* **Role-Based Access Control**:
    * `superAdmin`: unrestricted access.
    * `classAdmin`: restricted to specific `(Field, Semester)` pairs.
* **File Uploads**: Supports various file types (`.pdf`, `.zip`, `.mp4`, etc.), with metadata stored in the DB and files on the local filesystem.
* **Global Search**: A search bar to query resources by title.

### 🌐 Key Routes
* `/` (Home)
* `/fields/[fieldSlug]`
* `/fields/[fieldSlug]/semesters/[semesterNumber]`
* `/admin` (Admin dashboard, guarded)
* `/api/upload` (POST)
* `/api/files/[resourceId]/download` (Public streaming)
* `/api/search`

### 💾 Data Model (Prisma & Supabase)
* `User`: Managed by **Supabase Auth**. The `auth.users` table stores user information. Custom roles (`superAdmin` | `classAdmin`) can be managed via a separate `profiles` table or using Supabase's custom claims/metadata.
* `Field`: `id`, `name`, `slug` (unique)
* `Semester`: `id`, `number` (1-6), `fieldId` (FK)
* `Module`: `id`, `name`, `slug`, `semesterId` (FK)
* `Submodule`: `id`, `name`, `slug`, `moduleId` (FK)
* `Resource`: `id`, `title`, `type`, `fileUrl`, `sizeBytes`, `sha256`, `submoduleId` (FK), `uploadedByUserId` (FK to `auth.users.id`)
* `AdminScope`: `id`, `userId` (FK to `auth.users.id`), `fieldId` (FK), `semesterNumber`