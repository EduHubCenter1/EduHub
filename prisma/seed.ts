import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import { createSlug } from "../lib/utils"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting database seed...")

  // Create admin users
  console.log("👤 Creating admin users...")

  const superAdminPassword = await bcrypt.hash("admin123", 12)
  const classAdminPassword = await bcrypt.hash("class123", 12)

  const superAdmin = await prisma.user.upsert({
    where: { email: "admin@eduhub.com" },
    update: {},
    create: {
      name: "Super Admin",
      email: "admin@eduhub.com",
      role: "superAdmin",
      passwordHash: superAdminPassword,
    },
  })

  const classAdmin1 = await prisma.user.upsert({
    where: { email: "class1@eduhub.com" },
    update: {},
    create: {
      name: "Class Admin 1",
      email: "class1@eduhub.com",
      role: "classAdmin",
      passwordHash: classAdminPassword,
    },
  })

  const classAdmin2 = await prisma.user.upsert({
    where: { email: "class2@eduhub.com" },
    update: {},
    create: {
      name: "Class Admin 2",
      email: "class2@eduhub.com",
      role: "classAdmin",
      passwordHash: classAdminPassword,
    },
  })

  // Field 1: Sciences des Données, Big Data & IA
  console.log("📚 Creating Field 1: Sciences des Données, Big Data & IA...")

  const field1 = await prisma.field.upsert({
    where: { slug: "sciences-des-donnees-big-data-ia" },
    update: {},
    create: {
      name: "Sciences des Données, Big Data & IA",
      slug: "sciences-des-donnees-big-data-ia",
      description: "Formation spécialisée en science des données, intelligence artificielle et technologies big data",
    },
  })

  // Create 6 semesters for Field 1
  const field1Semesters = []
  for (let i = 1; i <= 6; i++) {
    const semester = await prisma.semester.upsert({
      where: { fieldId_number: { fieldId: field1.id, number: i } },
      update: {},
      create: {
        number: i,
        fieldId: field1.id,
      },
    })
    field1Semesters.push(semester)
  }

  // Field 1 Modules and Submodules
  const field1ModulesData = [
    // Semester 1
    [
      "Mathématiques pour l'Intelligence Artificielle",
      "Analyse numérique matricielle et Statistique",
      "Algorithmique & Programmation",
      "Réseaux informatique",
      "Architecture des ordinateurs et Systèmes d'exploitation",
      "Langues Etrangères 1",
      "Compétences numériques et informatique",
    ],
    // Semester 2
    [
      "Recherche Opérationnelle",
      "Compilation et Informatique quantique",
      "POO en Java",
      "Technologies Web",
      "Systèmes d'Information et Bases de Données",
      "Langues Etrangères 2",
      "Compétences artistiques et culturelles",
      "Stage",
    ],
    // Semester 3
    [
      "Structures de données avancée",
      "Architecture Logicielle et UML",
      "Fondements du Big Data",
      "Intelligence Artificielle I: Machine Learning",
      "Bases de données NOSQL",
      "Langues Etrangéres 3",
      "Technologies de l'intelligence artificielle",
    ],
    // Semester 4
    [
      "Systèmes décisionnels",
      "Intelligence Artificielle II: Deep Learning",
      "Computer Vision et Generative IA",
      "IoT et Cloud computing",
      "Développement mobile et Metaverse",
      "Langues Etrangères 4",
      "Gestion de projets et d'entreprises",
      "Stage",
    ],
    // Semester 5
    [
      "Big Data Avancées",
      "Traitement du langage naturel (NLP)",
      "Programmation et architecture Parallèle",
      "Blockchaine et Cybersécurité",
      "Systèmes embarqués et Robotique",
      "Langues Etrangères 5",
      "Compétences de vie et personnelles",
    ],
    // Semester 6
    ["Projet de fin d'études (PFE)"],
  ]

  for (let semesterIndex = 0; semesterIndex < 6; semesterIndex++) {
    const semester = field1Semesters[semesterIndex]
    const modules = field1ModulesData[semesterIndex]

    for (const moduleName of modules) {
      const moduleSlug = createSlug(moduleName)
      const module = await prisma.module.upsert({
        where: { semesterId_slug: { semesterId: semester.id, slug: moduleSlug } },
        update: {},
        create: {
          name: moduleName,
          slug: moduleSlug,
          semesterId: semester.id,
        },
      })

      // Create submodules for each module
      const submoduleNames = ["Partie 1", "Partie 2", "Travaux Pratiques"]
      for (const submoduleName of submoduleNames) {
        const submoduleSlug = createSlug(submoduleName)
        const submodule = await prisma.submodule.upsert({
          where: { moduleId_slug: { moduleId: module.id, slug: submoduleSlug } },
          update: {},
          create: {
            name: submoduleName,
            slug: submoduleSlug,
            moduleId: module.id,
          },
        })

        // Create sample resources
        if (submoduleName === "Partie 1") {
          await prisma.resource.upsert({
            where: { id: `${module.id}-${submodule.id}-course` },
            update: {},
            create: {
              id: `${module.id}-${submodule.id}-course`,
              title: `Cours ${moduleName}`,
              type: "course",
              description: `Support de cours pour ${moduleName}`,
              fileUrl: `fake-files/course-${moduleSlug}.pdf`,
              fileExt: "pdf",
              mimeType: "application/pdf",
              sizeBytes: 1024000,
              sha256: `fake-hash-${module.id}-${submodule.id}-course`,
              submoduleId: submodule.id,
              uploadedByUserId: superAdmin.id,
            },
          })
        }
      }
    }
  }

  // Field 2: Sécurité IT et Confiance Numérique
  console.log("🔒 Creating Field 2: Sécurité IT et Confiance Numérique...")

  const field2 = await prisma.field.upsert({
    where: { slug: "securite-it-et-confiance-numerique" },
    update: {},
    create: {
      name: "Sécurité IT et Confiance Numérique",
      slug: "securite-it-et-confiance-numerique",
      description: "Formation spécialisée en cybersécurité et confiance numérique",
    },
  })

  // Create 6 semesters for Field 2
  const field2Semesters = []
  for (let i = 1; i <= 6; i++) {
    const semester = await prisma.semester.upsert({
      where: { fieldId_number: { fieldId: field2.id, number: i } },
      update: {},
      create: {
        number: i,
        fieldId: field2.id,
      },
    })
    field2Semesters.push(semester)
  }

  // Field 2 Modules
  const field2ModulesData = [
    // Semester 1
    [
      "Mathématiques appliquées",
      "Architecture des ordinateurs et Systèmes d'exploitation",
      "Algorithmes et POO en Java",
      "Structures de données et Python",
      "Réseaux informatique",
      "Langues Etrangères 1",
      "Compétences numériques et informatiques",
    ],
    // Semester 2
    [
      "Recherche Opérationnelle",
      "Cryptographie appliquée et Informatique quantique",
      "Technologies WEB et Bases de données",
      "Systèmes embarqués et Cloud computing",
      "Architecture Logicielle et UML",
      "Langues Etrangères 2",
      "Compétences artistiques et culturelles",
      "Stage",
    ],
    // Semester 3
    [
      "Introduction à la sécurité des systèmes d'information",
      "Sécurité des réseaux",
      "Sécurité des systèmes d'exploitation",
      "Sécurité des bases de données & SDLC",
      "Droit des TIC et Gouvernance des SI",
      "Langues Etrangères 3",
      "Technologies de l'intelligence artificielle",
    ],
    // Semester 4
    [
      "Audit de la sécurité des systèmes d'information",
      "Data Mining et Big Data",
      "Intelligence Artificielle et applications à la cybersécurité",
      "Architecture et sécurité des systèmes complexes",
      "Ethical hacking et test d'intrusion",
      "Langues Etrangères 4",
      "Gestion de projets et d'entreprises",
      "Stage",
    ],
    // Semester 5
    [
      "Malware Analysis & Digital investigation",
      "Incident handling",
      "Sécurité des applications WEB et des applications Mobiles",
      "Sécurité de la virtualisation et du Cloud computing",
      "Gouvernance de la sécurité des SI",
      "Langues Etrangères 5",
      "Compétences de vie et personnelles",
    ],
    // Semester 6
    ["Projet de fin d'études (PFE)"],
  ]

  for (let semesterIndex = 0; semesterIndex < 6; semesterIndex++) {
    const semester = field2Semesters[semesterIndex]
    const modules = field2ModulesData[semesterIndex]

    for (const moduleName of modules) {
      const moduleSlug = createSlug(moduleName)
      const module = await prisma.module.upsert({
        where: { semesterId_slug: { semesterId: semester.id, slug: moduleSlug } },
        update: {},
        create: {
          name: moduleName,
          slug: moduleSlug,
          semesterId: semester.id,
        },
      })

      // Create submodules
      const submoduleNames = ["Théorie", "Pratique", "Évaluation"]
      for (const submoduleName of submoduleNames) {
        const submoduleSlug = createSlug(submoduleName)
        await prisma.submodule.upsert({
          where: { moduleId_slug: { moduleId: module.id, slug: submoduleSlug } },
          update: {},
          create: {
            name: submoduleName,
            slug: submoduleSlug,
            moduleId: module.id,
          },
        })
      }
    }
  }

  // Field 3: Management et Gouvernance des Systèmes d'Information
  console.log("💼 Creating Field 3: Management et Gouvernance des Systèmes d'Information...")

  const field3 = await prisma.field.upsert({
    where: { slug: "management-et-gouvernance-des-systemes-dinformation" },
    update: {},
    create: {
      name: "Management et Gouvernance des Systèmes d'Information",
      slug: "management-et-gouvernance-des-systemes-dinformation",
      description: "Formation en management et gouvernance des systèmes d'information",
    },
  })

  // Create 6 semesters for Field 3
  const field3Semesters = []
  for (let i = 1; i <= 6; i++) {
    const semester = await prisma.semester.upsert({
      where: { fieldId_number: { fieldId: field3.id, number: i } },
      update: {},
      create: {
        number: i,
        fieldId: field3.id,
      },
    })
    field3Semesters.push(semester)
  }

  // Field 3 Modules
  const field3ModulesData = [
    // Semester 1
    [
      "Mathématiques Appliquées",
      "Réseaux et Administration des systèmes",
      "Algorithmique et Programmation",
      "Architecture des ordinateurs et Systèmes d'exploitation",
      "Stratégie d'entreprise & SI",
      "Langues Etrangères 1",
      "Compétences numériques et informatiques",
    ],
    // Semester 2
    [
      "Recherche Opérationnelle",
      "Systèmes d'Information et Bases de Données Relationnelles",
      "Structures de données avancée",
      "POO en Java",
      "Technologie Web",
      "Langues Etrangères 2",
      "Compétences artistiques et culturelles",
      "Stage",
    ],
    // Semester 3
    [
      "Administration des Bases de données Avancées",
      "Systèmes d'Information Distribués",
      "Audit des SI",
      "Progiciels de gestion intégrée ERP",
      "Gestion de projet et Génie logiciel",
      "Langues Etrangères 3",
      "Technologies de l'intelligence artificielle",
    ],
    // Semester 4
    [
      "Systèmes décisionnels",
      "Gouvernance et Urbanisation des SI",
      "Sécurité des SI",
      "Cloud Computing et IoT",
      "Développement mobile",
      "Langues Etrangères 4",
      "Gestion de projets et d'entreprises",
      "Stage",
    ],
    // Semester 5
    [
      "Méthodes Agile de conception",
      "Blockchaine et applications",
      "Intelligence Artificielle",
      "Big Data et NOSQL",
      "Ingénierie logicielle, Qualité, Test et Intégration",
      "Langues Etrangères 5",
      "Compétences de vie et personnelles",
    ],
    // Semester 6
    ["Projet de fin d'études (PFE)"],
  ]

  for (let semesterIndex = 0; semesterIndex < 6; semesterIndex++) {
    const semester = field3Semesters[semesterIndex]
    const modules = field3ModulesData[semesterIndex]

    for (const moduleName of modules) {
      const moduleSlug = createSlug(moduleName)
      const module = await prisma.module.upsert({
        where: { semesterId_slug: { semesterId: semester.id, slug: moduleSlug } },
        update: {},
        create: {
          name: moduleName,
          slug: moduleSlug,
          semesterId: semester.id,
        },
      })

      // Create submodules
      const submoduleNames = ["Introduction", "Approfondissement", "Projet"]
      for (const submoduleName of submoduleNames) {
        const submoduleSlug = createSlug(submoduleName)
        await prisma.submodule.upsert({
          where: { moduleId_slug: { moduleId: module.id, slug: submoduleSlug } },
          update: {},
          create: {
            name: submoduleName,
            slug: submoduleSlug,
            moduleId: module.id,
          },
        })
      }
    }
  }
  console.log("💻 Creating Field 4: Ingénierie Logicielle...")

const field4 = await prisma.field.upsert({
  where: { slug: "ingenierie-logicielle" },
  update: {},
  create: {
    name: "Ingénierie Logicielle",
    slug: "ingenierie-logicielle",
    description: "Concentre sur la conception, le développement et la maintenance de logiciels de qualité, en appliquant des méthodes rigoureuses pour créer des solutions fiables, évolutives et adaptées aux besoins des utilisateurs.",
  },
})

// Create 6 semesters for Field 4
const field4Semesters = []
for (let i = 1; i <= 6; i++) {
  const semester = await prisma.semester.upsert({
    where: { fieldId_number: { fieldId: field4.id, number: i } },
    update: {},
    create: {
      number: i,
      fieldId: field4.id,
    },
  })
  field4Semesters.push(semester)
}

// Field 4 Modules
const field4ModulesData = [
  // Semester 1
  [
    "Mathématiques Appliquées",
    "Algorithmes et Programmation",
    "POO en Java",
    "Réseaux informatique",
    "Architecture des ordinateurs et Systèmes d’exploitation",
    "Langues Etrangères 1",
    "Compétences numériques et informatique",
  ],
  // Semester 2
  [
    "Recherche Opérationnelle",
    "Administration réseaux et systèmes",
    "Structures de données avancée",
    "Technologies Web",
    "Systèmes d’Information et Bases de Données Relationnelles",
    "Langues Etrangères 2",
    "Compétences artistiques et culturelles",
    "Stage",
  ],
  // Semester 3
  [
    "Programmation Python",
    "Compilation et Informatique quantique",
    "POO en C++ et Applications",
    "Développement WEB JEE",
    "Gestion de projet et Génie logiciel",
    "Langues Etrangères 3",
    "Technologies de l’intelligence artificielle",
  ],
  // Semester 4
  [
    "Systèmes décisionnels",
    "Ingénierie logicielle, Qualité, Test et Intégration",
    "Intelligence Artificielle",
    "Développement mobile et Metaverse",
    "IoT et Cloud computing",
    "Langues Etrangères 4",
    "Gestion de projets et d’entreprises",
    "Stage",
  ],
  // Semester 5
  [
    "Enterprise Resource Planning ERP",
    "Big Data et NoSQL",
    "Blockchaine et Sécurité",
    "Vision par ordinateur",
    "Tendances et évolutions IT",
    "Langues Etrangères 5",
    "Compétences de vie et personnelles",
  ],
  // Semester 6
  [
    "Projet de fin d’études (PFE)",
  ],
]

for (let semesterIndex = 0; semesterIndex < 6; semesterIndex++) {
  const semester = field4Semesters[semesterIndex]
  const modules = field4ModulesData[semesterIndex]

  for (const moduleName of modules) {
    const moduleSlug = createSlug(moduleName)
    const module = await prisma.module.upsert({
      where: { semesterId_slug: { semesterId: semester.id, slug: moduleSlug } },
      update: {},
      create: {
        name: moduleName,
        slug: moduleSlug,
        semesterId: semester.id,
      },
    })

    // Create submodules
    const submoduleNames = ["Partie 1", "Partie 2", "Travaux Pratiques"]
    for (const submoduleName of submoduleNames) {
      const submoduleSlug = createSlug(submoduleName)
      await prisma.submodule.upsert({
        where: { moduleId_slug: { moduleId: module.id, slug: submoduleSlug } },
        update: {},
        create: {
          name: submoduleName,
          slug: submoduleSlug,
          moduleId: module.id,
        },
      })
    }
  }
}

  // Create admin scopes for class admins
  console.log("🔑 Creating admin scopes...")

  // ClassAdmin1 manages Field1 Semesters 1-3
  for (let semester = 1; semester <= 3; semester++) {
    await prisma.adminScope.upsert({
      where: {
        userId_fieldId_semesterNumber: { userId: classAdmin1.id, fieldId: field1.id, semesterNumber: semester },
      },
      update: {},
      create: {
        userId: classAdmin1.id,
        fieldId: field1.id,
        semesterNumber: semester,
      },
    })
  }

  // ClassAdmin2 manages Field2 Semesters 1-2
  for (let semester = 1; semester <= 2; semester++) {
    await prisma.adminScope.upsert({
      where: {
        userId_fieldId_semesterNumber: { userId: classAdmin2.id, fieldId: field2.id, semesterNumber: semester },
      },
      update: {},
      create: {
        userId: classAdmin2.id,
        fieldId: field2.id,
        semesterNumber: semester,
      },
    })
  }

  console.log("✅ Database seeded successfully!")
  console.log("\n📋 Login credentials:")
  console.log("Super Admin: admin@eduhub.com / admin123")
  console.log("Class Admin 1: class1@eduhub.com / class123 (Field 1, Semesters 1-3)")
  console.log("Class Admin 2: class2@eduhub.com / class123 (Field 2, Semesters 1-2)")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
