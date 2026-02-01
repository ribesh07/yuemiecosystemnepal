import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { serializeBigInt } from "@/lib/serializeBigInt";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  // Pagination
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 20);
  const skip = (page - 1) * limit;

  // Filters
  const categoryId = searchParams.get("categoryId");
  const brandId = searchParams.get("brandId");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort");

  const weekly = searchParams.get("weekly");
  const flash = searchParams.get("flash");
  const special = searchParams.get("special");
  const today = searchParams.get("today");

  // WHERE condition (dynamic)
  const where: any = {
    status: 1,
  };

  if (categoryId) where.categoryId = BigInt(categoryId);
  if (brandId) where.brandId = Number(brandId);

  if (minPrice || maxPrice) {
    where.sellPrice = {};
    if (minPrice) where.sellPrice.gte = Number(minPrice);
    if (maxPrice) where.sellPrice.lte = Number(maxPrice);
  }

  if (weekly === "true") where.weeklyProduct = true;
  if (flash === "true") where.flashSaleProduct = true;
  if (special === "true") where.specialProduct = true;
  if (today === "true") where.todayDeals = true;

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { brandName: { contains: search } },
      { categoryName: { contains: search } },
    ];
  }

  // Sorting
  let orderBy: any = { createdAt: "desc" };

  if (sort === "price_asc") orderBy = { sellPrice: "asc" };
  if (sort === "price_desc") orderBy = { sellPrice: "desc" };
  if (sort === "latest") orderBy = { createdAt: "desc" };

  // Query
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: true,
        brand: true,
      },
      skip,
      take: limit,
      orderBy,
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json(
    serializeBigInt({
        success : true,
      data: {
        
        products:products
    },
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  );
}
