To make the project ready for the `gemini` CLI, you should create a `GEMINI.md` file at the root of the project directory.

The `GEMINI.md` file serves as a blueprint for the Gemini CLI to understand and generate the project's code. It outlines the project's purpose, key features, technical stack, and a high-level overview of the data model and API endpoints.

Here is the content for the `GEMINI.md` file, which encapsulates the entire project specification provided:

```
## 🌟 ENSIASDHUB: An Academic Hub for Students

### 📌 Product Summary
ENSIASDHUB is a production-ready, student-run web application designed to be a central academic resource hub. It organizes and provides read-only access to a hierarchical structure of academic materials. The hierarchy is strictly defined as **Field → Semester (1-6) → Module → Submodule → Resource**.

* **Public Users (Students)**: Unauthenticated, read-only access to browse and download resources.
* **Admins**: Authenticated users who can manage resources within a specific scope.
* **SuperAdmin**: Full control over all content and admin scopes.

### 💻 Tech Stack
* **Framework**: Next.js 14 with App Router & TypeScript
* **UI**: Tailwind CSS, shadcn/ui, lucide-react
* **State/Server**: Next.js Server Actions & Route Handlers
* **Database**: PostgreSQL with Prisma ORM
* **Authentication**: NextAuth.js (Credentials Provider) for admins only
* **Storage**: Local filesystem (abstracted for future cloud integration like S3)
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

### 💾 Data Model (Prisma)
* `Field`: `id`, `name`, `slug` (unique)
* `Semester`: `id`, `number` (1-6), `fieldId` (FK)
* `Module`: `id`, `name`, `slug`, `semesterId` (FK)
* `Submodule`: `id`, `name`, `slug`, `moduleId` (FK)
* `Resource`: `id`, `title`, `type`, `fileUrl`, `sizeBytes`, `sha256`, `submoduleId` (FK), `uploadedByUserId` (FK)
* `User`: `id`, `name`, `email`, `role` (`superAdmin`|`classAdmin`), `passwordHash`
* `AdminScope`: `id`, `userId` (FK), `fieldId` (FK), `semesterNumber`

