import { PrismaClient } from "@prisma/client"
import { createSlug } from "../lib/utils"
import submodulesData from "./submodules.json";

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting database seed (fields, semesters, modules, submodules)...")

  // =========================
  // 1️⃣ Fields data
  // =========================
  const fieldsData = [
    {
      slug: "sciences-des-donnees-big-data-ia",
      name: "Sciences des Données, Big Data & IA",
      description: "Formation spécialisée en science des données, intelligence artificielle et technologies big data",
      modules: [
        [
          "Mathématiques pour l'Intelligence Artificielle",
          "Analyse numérique matricielle et Statistique",
          "Algorithmique & Programmation",
          "Réseaux informatique",
          "Architecture des ordinateurs et Systèmes d'exploitation",
          "Langues Etrangères 1",
          "Compétences numériques et informatique",
        ],
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
        [
          "Structures de données avancée",
          "Architecture Logicielle et UML",
          "Fondements du Big Data",
          "Intelligence Artificielle I: Machine Learning",
          "Bases de données NOSQL",
          "Langues Etrangéres 3",
          "Technologies de l'intelligence artificielle",
        ],
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
        [
          "Big Data Avancées",
          "Traitement du langage naturel (NLP)",
          "Programmation et architecture Parallèle",
          "Blockchain et Cybersécurité",
          "Systèmes embarqués et Robotique",
          "Langues Etrangères 5",
          "Compétences de vie et personnelles",
        ],
        ["Projet de fin d'études (PFE)"],
      ],
    },
    {
      slug: "securite-it-et-confiance-numerique",
      name: "Sécurité IT et Confiance Numérique",
      description: "Formation spécialisée en cybersécurité et confiance numérique",
      modules: [
        [
          "Mathématiques appliquées",
          "Architecture des ordinateurs et Systèmes d'exploitation",
          "Algorithmes et POO en Java",
          "Structures de données et Python",
          "Réseaux informatique",
          "Langues Etrangères 1",
          "Compétences numériques et informatiques",
        ],
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
        [
          "Introduction à la sécurité des systèmes d'information",
          "Sécurité des réseaux",
          "Sécurité des systèmes d'exploitation",
          "Sécurité des bases de données & SDLC",
          "Droit des TIC et Gouvernance des SI",
          "Langues Etrangères 3",
          "Technologies de l'intelligence artificielle",
        ],
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
        [
          "Malware Analysis & Digital investigation",
          "Incident handling",
          "Sécurité des applications WEB et des applications Mobiles",
          "Sécurité de la virtualisation et du Cloud computing",
          "Gouvernance de la sécurité des SI",
          "Langues Etrangères 5",
          "Compétences de vie et personnelles",
        ],
        ["Projet de fin d'études (PFE)"],
      ],
    },
    {
      slug: "management-et-gouvernance-des-systemes-dinformation",
      name: "Management et Gouvernance des Systèmes d'Information",
      description: "Formation en management et gouvernance des systèmes d'information",
      modules: [
        [
          "Mathématiques Appliquées",
          "Réseaux et Administration des systèmes",
          "Algorithmique et Programmation",
          "Architecture des ordinateurs et Systèmes d'exploitation",
          "Stratégie d'entreprise & SI",
          "Langues Etrangères 1",
          "Compétences numériques et informatiques",
        ],
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
        [
          "Administration des Bases de données Avancées",
          "Systèmes d'Information Distribués",
          "Audit des SI",
          "Progiciels de gestion intégrée ERP",
          "Gestion de projet et Génie logiciel",
          "Langues Etrangères 3",
          "Technologies de l'intelligence artificielle",
        ],
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
        [
          "Méthodes Agile de conception",
          "Blockchain et applications",
          "Intelligence Artificielle",
          "Big Data et NOSQL",
          "Ingénierie logicielle, Qualité, Test et Intégration",
          "Langues Etrangères 5",
          "Compétences de vie et personnelles",
        ],
        ["Projet de fin d'études (PFE)"],
      ],
    },
    {
      slug: "ingenierie-logicielle",
      name: "Ingénierie Logicielle",
      description:
        "Concentre sur la conception, le développement et la maintenance de logiciels de qualité, en appliquant des méthodes rigoureuses pour créer des solutions fiables, évolutives et adaptées aux besoins des utilisateurs.",
      modules: [
        [
          "Mathématiques Appliquées",
          "Algorithmes et Programmation",
          "POO en Java",
          "Réseaux informatique",
          "Architecture des ordinateurs et Systèmes d’exploitation",
          "Langues Etrangères 1",
          "Compétences numériques et informatique",
        ],
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
        [
          "Programmation Python",
          "Compilation et Informatique quantique",
          "POO en C++ et Applications",
          "Développement WEB JEE",
          "Gestion de projet et Génie logiciel",
          "Langues Etrangères 3",
          "Technologies de l’intelligence artificielle",
        ],
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
        [
          "Enterprise Resource Planning ERP",
          "Big Data et NoSQL",
          "Blockchain et Sécurité",
          "Vision par ordinateur",
          "Tendances et évolutions IT",
          "Langues Etrangères 5",
          "Compétences de vie et personnelles",
        ],
        ["Projet de fin d’études (PFE)"],
      ],
    },
  ]

  // =========================
  // Seed fields
  // =========================
  for (const fieldData of fieldsData) {
    const field = await prisma.fields.upsert({
      where: { slug: fieldData.slug },
      update: {},
      create: {
        name: fieldData.name,
        slug: fieldData.slug,
        description: fieldData.description,
      },
    })

    const semesters: any[] = []
    for (let i = 0; i < 6; i++) {
      const semester = await prisma.semester.upsert({
        where: { fieldId_number: { fieldId: field.id, number: i + 1 } },
        update: {},
        create: {
          number: i + 1,
          fieldId: field.id,
        },
      })
      semesters.push(semester)
    }

    // Modules & Submodules
    for (let semesterIndex = 0; semesterIndex < 6; semesterIndex++) {
      const semester = semesters[semesterIndex];
      const modules = fieldData.modules[semesterIndex] || [];

      for (const moduleName of modules) {
        const moduleSlug = createSlug(moduleName);
        const module = await prisma.module.upsert({
          where: { semesterId_slug: { semesterId: semester.id, slug: moduleSlug } },
          update: {},
          create: {
            name: moduleName,
            slug: moduleSlug,
            semesterId: semester.id,
          },
        });

// ✅ Gestion des submodules
// Force TypeScript à accepter les index dynamiques
const fieldSubmodules = (submodulesData as Record<string, any>)[fieldData.slug];
        const semesterKey = semesterIndex.toString();

        if (
          fieldSubmodules &&
          fieldSubmodules[semesterKey] &&
          fieldSubmodules[semesterKey][moduleName]
        ) {
          const submodules = fieldSubmodules[semesterKey][moduleName];
          const dataToInsert = submodules.map((subName: string) => ({
            name: subName,
            slug: createSlug(subName),
            moduleId: module.id,
          }));

          if (dataToInsert.length > 0) {
            await prisma.submodule.createMany({ data: dataToInsert });
          }
        }
      }
    }
  }
  console.log("✅ Database seeded successfully!")
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
    