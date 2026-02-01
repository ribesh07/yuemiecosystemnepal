import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const accessories = [
  {
    category: "Car Safety",
    title: "Dash Camera System",
    description: "Dual-lens dashboard camera with front and rear recording",
    image: "/uploads/categories/Car-Safety_1.webp",
  },
  {
    category: "Car Infotainment System",
    title: "YueMi Ecosystem Display",
    description: "Advanced touchscreen infotainment system",
    image: "/uploads/catrgories/Car-Infotainment-System.webp",
  },
  {
    category: "LED Lights",
    title: "High-Performance LED Headlights",
    description: "Ultra-bright LED conversion kit",
    image: "/uploads/catrgories/Led-Lights.webp",
  },
  {
    category: "Damping & Acoustics",
    title: "Sound Deadening Materials",
    description: "Premium acoustic dampening pads",
    image: "/uploads/catrgories/Damping-_-Acoustics_1.webp",
  },
  {
    category: "Amplifier",
    title: "YueMi Class D Amplifier",
    description: "4x100W professional car audio amplifier",
    image: "/uploads/catrgories/Amplifier.webp",
  },
  {
    category: "Accessories",
    title: "Car Accessories Kit",
    description: "Essential car maintenance and styling accessories",
    image: "/uploads/catrgories/Accessories.webp",
  },
  {
    category: "Car Care & Protection",
    title: "Premium Car Model",
    description: "High-performance sports car with protection package",
    image: "/uploads/catrgories/Car-Care-_-Protection_1.webp",
  },
];


async function main() {
  console.log("🌱 Seeding categories...");

  const categories = await prisma.category.findMany();
  if(!categories)
  for (const item of accessories) {
    await prisma.category.upsert({
      where: {
        category: item.category, // unique
      },
      update: {
        title: item.title,
        description: item.description,
        image: item.image,
        status: 1,
        top: 0,
      },
      create: {
        category: item.category,
        title: item.title,
        description: item.description,
        image: item.image,
        status: 1,
        top: 0,
      },
    });
  }

  if(categories){
    console.log("Already Added Categories !!")
  }
  console.log("✅ Categories seeded successfully");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
