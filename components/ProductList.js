import Image from "next/image";

const products = [
  {
    id: 1,
    title: "Titanium SunRoof PPF",
    category: "PPF",
    price: 540,
    promo: "discount",
    image: "https://yuemiecosystem.com/cdn/shop/files/WhatsAppImage2026-01-12at11.13.32.jpg?v=1768370208",
  },
  {
    id: 2,
    title: "Large MPV - I Series",
    category: "I Series Tint Film",
    price: 4500,
    promo: "wholesale",
    image: "https://yuemiecosystem.com/cdn/shop/files/WhatsAppImage2026-01-10at19.20.14.jpg?v=1768378204",
  },
  {
    id: 3,
    title: "Mini MPV / SUV - M Series",
    category: "M Series Tint Film",
    price: 4200,
    promo: "addon",
    image: "https://yuemiecosystem.com/cdn/shop/files/WhatsAppImage2025-06-12at12.11.25.jpg?v=1749808876",
  },
  {
    id: 4,
    title: "Large Saloon Car - E Series",
    category: "E Series Tint Film",
    price: 3800,
    promo: "discount",
    image: "https://yuemiecosystem.com/cdn/shop/files/WhatsAppImage2025-05-10at12.21.45_1.jpg?v=1746869508",
  },
];

export default function ProductList({ filters }) {
  let filtered = products.filter((p) => {
    const matchSearch = p.title
      .toLowerCase()
      .includes(filters.search.toLowerCase());

    const matchCategory =
      !filters.category || p.category === filters.category;

    const matchPromo =
      !filters.promo || p.promo === filters.promo;

    const matchMin =
      !filters.minPrice || p.price >= Number(filters.minPrice);

    const matchMax =
      !filters.maxPrice || p.price <= Number(filters.maxPrice);

    return (
      matchSearch &&
      matchCategory &&
      matchPromo &&
      matchMin &&
      matchMax
    );
  });

  // Sorting
  if (filters.sort === "priceLow") {
    filtered.sort((a, b) => a.price - b.price);
  }
  if (filters.sort === "priceHigh") {
    filtered.sort((a, b) => b.price - a.price);
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {filtered.length === 0 && (
        <p className="col-span-full text-center text-gray-500">
          No products found.
        </p>
      )}

      {filtered.map((product) => (
        <div
          key={product.id}
          className="border rounded-lg overflow-hidden hover:shadow-lg transition"
        >
          <div className="relative w-full h-48 bg-gray-100">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="p-3 text-center">
            <h3 className="font-medium text-sm mb-1">
              {product.title}
            </h3>
            <p className="text-orange-600 font-semibold text-sm">
              Rs {product.price.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">
              {product.category}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
