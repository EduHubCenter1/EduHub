-- Create EduHub database
-- Run this script to set up the initial database

-- Create database (uncomment if needed)
-- CREATE DATABASE eduhub;

-- Connect to the database
-- \c eduhub;

-- The Prisma schema will handle table creation
-- This script is for reference and initial setup

-- Ensure proper permissions
-- GRANT ALL PRIVILEGES ON DATABASE eduhub TO your_user;

-- Create uploads directory structure (this would be done by the application)
-- mkdir -p uploads/sciences-des-donnees-big-data-ia/S1
-- mkdir -p uploads/sciences-des-donnees-big-data-ia/S2
-- mkdir -p uploads/sciences-des-donnees-big-data-ia/S3
-- mkdir -p uploads/sciences-des-donnees-big-data-ia/S4
-- mkdir -p uploads/sciences-des-donnees-big-data-ia/S5
-- mkdir -p uploads/sciences-des-donnees-big-data-ia/S6

-- mkdir -p uploads/securite-it-et-confiance-numerique/S1
-- mkdir -p uploads/securite-it-et-confiance-numerique/S2
-- mkdir -p uploads/securite-it-et-confiance-numerique/S3
-- mkdir -p uploads/securite-it-et-confiance-numerique/S4
-- mkdir -p uploads/securite-it-et-confiance-numerique/S5
-- mkdir -p uploads/securite-it-et-confiance-numerique/S6

-- mkdir -p uploads/management-et-gouvernance-des-systemes-dinformation/S1
-- mkdir -p uploads/management-et-gouvernance-des-systemes-dinformation/S2
-- mkdir -p uploads/management-et-gouvernance-des-systemes-dinformation/S3
-- mkdir -p uploads/management-et-gouvernance-des-systemes-dinformation/S4
-- mkdir -p uploads/management-et-gouvernance-des-systemes-dinformation/S5
-- mkdir -p uploads/management-et-gouvernance-des-systemes-dinformation/S6

SELECT 'Database setup complete!' as status;
