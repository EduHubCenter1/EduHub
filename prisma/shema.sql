-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.admin_scopes (
  id text NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  field_id text NOT NULL,
  semester_number integer NOT NULL,
  CONSTRAINT admin_scopes_pkey PRIMARY KEY (id),
  CONSTRAINT admin_scopes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT admin_scopes_field_id_fkey FOREIGN KEY (field_id) REFERENCES public.fields(id)
);
CREATE TABLE public.fields (
  id text NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT fields_pkey PRIMARY KEY (id)
);
CREATE TABLE public.modules (
  id text NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL,
  semester_id text NOT NULL,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT modules_pkey PRIMARY KEY (id),
  CONSTRAINT modules_semester_id_fkey FOREIGN KEY (semester_id) REFERENCES public.semesters(id)
);
CREATE TABLE public.resources (
  id text NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  type text NOT NULL CHECK (type = ANY (ARRAY['course'::text, 'exam'::text, 'tp_exercise'::text, 'project'::text, 'presentation'::text, 'report'::text, 'other'::text])),
  description text,
  file_url text NOT NULL,
  file_ext text NOT NULL,
  mime_type text NOT NULL,
  size_bytes integer NOT NULL,
  sha256 text NOT NULL,
  submodule_id text NOT NULL,
  uploaded_by_user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  module_id text NOT NULL,
  CONSTRAINT resources_pkey PRIMARY KEY (id),
  CONSTRAINT resources_uploadedbyuser_id_fkey FOREIGN KEY (uploaded_by_user_id) REFERENCES public.users(id),
  CONSTRAINT resources_submodule_id_fkey FOREIGN KEY (submodule_id) REFERENCES public.submodules(id),
  CONSTRAINT resources_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.modules(id)
);
CREATE TABLE public.semesters (
  id text NOT NULL DEFAULT gen_random_uuid(),
  number integer NOT NULL,
  field_id text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT semesters_pkey PRIMARY KEY (id),
  CONSTRAINT semesters_field_id_fkey FOREIGN KEY (field_id) REFERENCES public.fields(id)
);
CREATE TABLE public.submodules (
  id text NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL,
  module_id text NOT NULL,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT submodules_pkey PRIMARY KEY (id),
  CONSTRAINT submodules_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.modules(id)
);
CREATE TABLE public.users (
  id uuid NOT NULL,
  first_name text,
  last_name text,
  email text NOT NULL UNIQUE,
  role text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);