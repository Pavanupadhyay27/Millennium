import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Seed Admin & Customer User
  const admin = await prisma.user.upsert({
    where: { email: "admin@millenniumfurniture.in" },
    update: {},
    create: {
      name: "Millennium Admin",
      email: "admin@millenniumfurniture.in",
      phone: "+91 674 2530190",
      role: "ADMIN",
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "Pk@gmail.com" },
    update: {},
    create: {
      name: "Pawan",
      email: "Pk@gmail.com",
      phone: "+91 70081 29381",
      role: "CUSTOMER",
    },
  });

  // Seed Products
  const prod1 = await prisma.product.upsert({
    where: { slug: "odisha-teak-lounge-chair" },
    update: {},
    create: {
      name: "Odisha Teak Lounge Chair",
      slug: "odisha-teak-lounge-chair",
      description: "Sculpted by master craftsmen in Bhubaneswar using sustainably harvested solid teak timber with custom joinery.",
      price: 24500,
      wholesalePrice: 18500,
      images: ["https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?auto=format&fit=crop&q=80&w=700"],
      space: "home",
      categoryName: "Lounge Chairs",
      material: "Solid Teak Wood",
      colorName: "Natural Teak",
      rating: 4.9,
      stock: 15,
      featured: true,
    },
  });

  const prod2 = await prisma.product.upsert({
    where: { slug: "aura-curved-velvet-sofa" },
    update: {},
    create: {
      name: "Aura Curved Velvet Sofa",
      slug: "aura-curved-velvet-sofa",
      description: "Architectural curved 3-seater sofa framed in solid Odishan timber and upholstered in stain-resistant velvet fabric.",
      price: 84999,
      wholesalePrice: 62000,
      images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=700"],
      space: "home",
      categoryName: "Sofas",
      material: "Velvet & Teak Frame",
      colorName: "Forest Emerald",
      rating: 4.8,
      stock: 8,
      featured: true,
    },
  });

  // Seed Wholesale Inquiry
  await prisma.wholesaleInquiry.create({
    data: {
      name: "Subhakanta Jena",
      companyName: "Mayfair Hotels & Resorts",
      email: "purchase@mayfairhotels.com",
      phone: "+91 94370 12345",
      city: "Bhubaneswar",
      itemTitle: "Odisha Teak Lounge Chair",
      quantity: 45,
      notes: "Requires 45 units with custom walnut stain for luxury resort patio.",
      status: "NEW",
    },
  });

  console.log("Seeding finished successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
