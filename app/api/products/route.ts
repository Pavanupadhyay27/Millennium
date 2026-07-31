import { NextResponse } from "next/server";
import { requireAdmin, safeErrorResponse } from "../../../lib/apiAuth";
import { rateLimitResponse } from "../../../lib/rateLimit";
import { secureId } from "../../../lib/auth";

let PRODUCTS_DB = [
  {
    id: "prod-1",
    name: "Odisha Teak Lounge Chair",
    slug: "odisha-teak-lounge-chair",
    description: "Sculpted by master craftsmen in Bhubaneswar using sustainably harvested solid teak timber with custom joinery and non-toxic matte finish.",
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
    createdAt: new Date().toISOString()
  },
  {
    id: "prod-2",
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
    createdAt: new Date().toISOString()
  },
  {
    id: "prod-3",
    name: "Kalinga Teak Executive Desk",
    slug: "kalinga-teak-executive-desk",
    description: "Mid-century modern executive desk engineered with cable routing ports and soft-close solid teak drawers.",
    price: 48900,
    wholesalePrice: 36000,
    images: ["https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=700"],
    space: "office",
    categoryName: "Executive Desks",
    material: "Solid Teak Wood",
    colorName: "Natural Teak",
    rating: 5.0,
    stock: 12,
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "prod-4",
    name: "Solstice Outdoor Teak Dining Set",
    slug: "solstice-outdoor-teak-dining-set",
    description: "Weather-resistant 6-seater outdoor patio dining table crafted from grade-A teak with UV protective finish.",
    price: 92000,
    wholesalePrice: 71000,
    images: ["https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80&w=700"],
    space: "outdoor",
    categoryName: "Patio Dining",
    material: "Grade-A Outdoor Teak",
    colorName: "Teak Natural",
    rating: 4.9,
    stock: 5,
    featured: false,
    createdAt: new Date().toISOString()
  }
];

export async function GET(request: Request) {
  // Public GET route for catalog browsing, rate limited to 60 req/min
  const limited = rateLimitResponse(request, { windowMs: 60_000, max: 60 });
  if (limited) return limited;

  const { searchParams } = new URL(request.url);
  const space = searchParams.get("space");
  const category = searchParams.get("category");
  const query = searchParams.get("query");

  let filtered = [...PRODUCTS_DB];

  if (space && space !== "all") {
    filtered = filtered.filter((p) => p.space.toLowerCase() === space.toLowerCase());
  }

  if (category && category !== "all") {
    filtered = filtered.filter((p) => p.categoryName.toLowerCase() === category.toLowerCase());
  }

  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({
    success: true,
    total: filtered.length,
    products: filtered,
  });
}

export async function POST(request: Request) {
  // REQUIRE ADMIN AUTHENTICATION to create products (H1 fix)
  const authError = requireAdmin(request);
  if (authError) return authError;

  // Rate limit admin product creations
  const limited = rateLimitResponse(request, { windowMs: 60_000, max: 20 });
  if (limited) return limited;

  try {
    const body = await request.json();

    if (!body.name || !body.price) {
      return NextResponse.json(
        { success: false, error: "Product name and price are required" },
        { status: 400 }
      );
    }

    const cleanName = String(body.name).trim().slice(0, 150);
    const cleanSlug = body.slug
      ? String(body.slug).trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")
      : cleanName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const newProduct = {
      id: secureId("prod"),
      name: cleanName,
      slug: cleanSlug,
      description: body.description ? String(body.description).slice(0, 1000) : "Handcrafted solid timber furniture.",
      price: Number(body.price),
      wholesalePrice: Number(body.wholesalePrice) || Math.round(Number(body.price) * 0.75),
      images: Array.isArray(body.images) && body.images.length > 0 ? body.images : ["https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?auto=format&fit=crop&q=80&w=700"],
      space: body.space ? String(body.space).toLowerCase() : "home",
      categoryName: body.categoryName ? String(body.categoryName) : "Chairs",
      material: body.material ? String(body.material) : "Solid Teak Wood",
      colorName: body.colorName ? String(body.colorName) : "Natural Teak",
      rating: 5.0,
      stock: Number(body.stock) || 10,
      featured: Boolean(body.featured),
      createdAt: new Date().toISOString()
    };

    PRODUCTS_DB.unshift(newProduct);

    return NextResponse.json(
      { success: true, message: "Product created successfully", product: newProduct },
      { status: 201 }
    );
  } catch (error) {
    return safeErrorResponse(error, "Failed to create product");
  }
}
