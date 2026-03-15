
export interface Product {
    id: string | number;
    name: string;
    description: string;
    price: number;
    categories: string[];
    images: string[];
    isNew?: boolean;
    created_at?: string;
    brand?: string;
    in_stock?: boolean;
    product_type?: 'simple' | 'variable';
    variations?: Array<{
        id: string;
        name: string;
        price: number;
        stock?: number;
        sku?: string;
        is_default?: boolean;
    }>;
}

// All products data for DedayCart Shoe Store
export const products: Product[] = [
    {
        id: 1,
        created_at: "2026-03-15T10:00:00.000Z",
        name: "Nike Air Max 270",
        brand: "Nike",
        images: [
            "https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=800",
            "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800",
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
            "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800"
        ],
        price: 12999,
        categories: ["Running", "Casual"],
        description: "{\"productDescription\":\"Experience ultimate comfort with the Nike Air Max 270. Featuring Nike's biggest heel Air unit yet for unrivaled cushioning, this shoe delivers incredible all-day comfort. The sleek design and breathable mesh upper make it perfect for both running and casual wear.\",\"productDetails\":\"• Brand: Nike\\n• Category: Running Shoes, Casual Sneakers\\n• Upper Material: Breathable mesh and synthetic overlays\\n• Midsole: Full-length foam with large Air unit in heel\\n• Outsole: Durable rubber with flex grooves\\n• Closure: Lace-up\\n• Available Sizes: 6, 7, 8, 9, 10, 11, 12\\n• Color Options: Black/White, Navy/Blue, Red/Black\",\"careInstructions\":\"• Clean with a soft, damp cloth\\n• Air dry at room temperature\\n• Avoid machine washing\\n• Store in a cool, dry place\"}",
        product_type: "variable",
        variations: [
            { id: "1", name: "Size 8", price: 12999, stock: 15, is_default: true },
            { id: "2", name: "Size 9", price: 12999, stock: 20 },
            { id: "3", name: "Size 10", price: 12999, stock: 18 },
            { id: "4", name: "Size 11", price: 12999, stock: 12 },
        ],
        isNew: true,
    },
    {
        id: 2,
        created_at: "2026-03-15T09:30:00.000Z",
        name: "Adidas Ultraboost 22",
        brand: "Adidas",
        in_stock: false,
        images: [
            "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800",
            "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800",
            "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800",
            "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800"
        ],
        price: 15999,
        categories: ["Running", "Sports"],
        description: "{\"productDescription\":\"The Adidas Ultraboost 22 delivers incredible energy return with every stride. Featuring responsive Boost cushioning and a Primeknit upper, these shoes provide a sock-like fit that adapts to your foot. Perfect for runners seeking maximum comfort and performance.\",\"productDetails\":\"• Brand: Adidas\\n• Category: Running Shoes, Performance\\n• Upper Material: Primeknit textile\\n• Midsole: Boost technology for energy return\\n• Outsole: Continental rubber for superior grip\\n• Closure: Lace-up\\n• Available Sizes: 7, 8, 9, 10, 11, 12\\n• Color Options: Core Black, Cloud White, Solar Red\",\"careInstructions\":\"• Wipe clean with damp cloth\\n• Do not bleach\\n• Air dry only\\n• Keep away from direct heat\"}",
        product_type: "variable",
        variations: [
            { id: "1", name: "Size 8", price: 15999, stock: 10, is_default: true },
            { id: "2", name: "Size 9", price: 15999, stock: 15 },
            { id: "3", name: "Size 10", price: 15999, stock: 12 },
            { id: "4", name: "Size 11", price: 15999, stock: 8 },
        ],
        isNew: true,
    },
    {
        id: 3,
        created_at: "2026-03-15T09:00:00.000Z",
        name: "Puma RS-X Efekt",
        brand: "Puma",
        images: [
            "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800",
            "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800",
            "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800",
            "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=800"
        ],
        price: 9999,
        categories: ["Casual", "Lifestyle"],
        description: "{\"productDescription\":\"Make a bold statement with the Puma RS-X Efekt. This chunky sneaker features a retro-inspired design with vibrant color blocking and premium materials. The running system technology provides exceptional comfort for all-day wear.\",\"productDetails\":\"• Brand: Puma\\n• Category: Lifestyle Sneakers, Casual\\n• Upper Material: Mesh and synthetic leather\\n• Midsole: RS cushioning technology\\n• Outsole: Rubber for traction\\n• Closure: Lace-up\\n• Available Sizes: 6, 7, 8, 9, 10, 11\\n• Color Options: White/Multi, Black/Red, Blue/Yellow\",\"careInstructions\":\"• Clean with mild soap and water\\n• Air dry naturally\\n• Avoid harsh chemicals\\n• Store in original box when not in use\"}",
        product_type: "variable",
        variations: [
            { id: "1", name: "Size 8", price: 9999, stock: 20, is_default: true },
            { id: "2", name: "Size 9", price: 9999, stock: 25 },
            { id: "3", name: "Size 10", price: 9999, stock: 18 },
        ],
    },
    {
        id: 4,
        created_at: "2026-03-14T18:00:00.000Z",
        name: "Nike React Infinity Run",
        brand: "Nike",
        images: [
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
            "https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=800",
            "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800",
            "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800"
        ],
        price: 13999,
        categories: ["Running", "Sports"],
        description: "{\"productDescription\":\"The Nike React Infinity Run is designed to help reduce injury and keep you on the run. The wider forefoot and higher foam provide a stable, cushioned feel. The secure fit and soft, supportive feel make every mile more comfortable.\",\"productDetails\":\"• Brand: Nike\\n• Category: Running Shoes\\n• Upper Material: Flyknit textile\\n• Midsole: Nike React foam\\n• Outsole: Rubber with data-informed tread pattern\\n• Closure: Lace-up\\n• Available Sizes: 7, 8, 9, 10, 11, 12\\n• Color Options: Black/White, Blue/Orange, Pink/Purple\",\"careInstructions\":\"• Clean with soft brush and mild detergent\\n• Air dry only\\n• Do not expose to extreme heat\\n• Store in ventilated area\"}",
        product_type: "variable",
        variations: [
            { id: "1", name: "Size 8", price: 13999, stock: 12, is_default: true },
            { id: "2", name: "Size 9", price: 13999, stock: 16 },
            { id: "3", name: "Size 10", price: 13999, stock: 14 },
        ],
        isNew: true,
    },
    {
        id: 5,
        created_at: "2026-03-14T17:00:00.000Z",
        name: "Adidas Stan Smith",
        brand: "Adidas",
        images: [
            "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800",
            "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800",
            "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800"
        ],
        price: 7999,
        categories: ["Casual", "Lifestyle"],
        description: "{\"productDescription\":\"The iconic Adidas Stan Smith brings timeless style to your everyday look. Featuring a clean leather upper and the classic perforated 3-Stripes, these sneakers are a wardrobe essential. Perfect for casual outings and streetwear fashion.\",\"productDetails\":\"• Brand: Adidas\\n• Category: Lifestyle Sneakers, Casual\\n• Upper Material: Premium leather\\n• Midsole: Lightweight EVA\\n• Outsole: Rubber\\n• Closure: Lace-up\\n• Available Sizes: 6, 7, 8, 9, 10, 11, 12\\n• Color Options: White/Green, White/Navy, All White\",\"careInstructions\":\"• Wipe with damp cloth\\n• Use leather cleaner for tough stains\\n• Air dry naturally\\n• Avoid prolonged sun exposure\"}",
        product_type: "variable",
        variations: [
            { id: "1", name: "Size 8", price: 7999, stock: 30, is_default: true },
            { id: "2", name: "Size 9", price: 7999, stock: 35 },
            { id: "3", name: "Size 10", price: 7999, stock: 28 },
            { id: "4", name: "Size 11", price: 7999, stock: 22 },
        ],
    },
    {
        id: 6,
        created_at: "2026-03-14T16:00:00.000Z",
        name: "Puma Suede Classic",
        brand: "Puma",
        in_stock: false,
        images: [
            "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800",
            "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800",
            "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=800"
        ],
        price: 6999,
        categories: ["Casual", "Lifestyle"],
        description: "{\"productDescription\":\"The Puma Suede Classic is a legendary sneaker that has stood the test of time. With its iconic suede upper and simple yet stylish design, this shoe is perfect for those who appreciate retro fashion and everyday comfort.\",\"productDetails\":\"• Brand: Puma\\n• Category: Lifestyle Sneakers, Retro\\n• Upper Material: Premium suede\\n• Midsole: Rubber\\n• Outsole: Gum rubber for grip\\n• Closure: Lace-up\\n• Available Sizes: 6, 7, 8, 9, 10, 11\\n• Color Options: Black/White, Navy/White, Burgundy/White\",\"careInstructions\":\"• Use suede brush for cleaning\\n• Protect with suede protector spray\\n• Avoid water and moisture\\n• Store in dust bag when not in use\"}",
        product_type: "variable",
        variations: [
            { id: "1", name: "Size 8", price: 6999, stock: 25, is_default: true },
            { id: "2", name: "Size 9", price: 6999, stock: 28 },
            { id: "3", name: "Size 10", price: 6999, stock: 20 },
        ],
    },
    {
        id: 7,
        created_at: "2026-03-14T15:00:00.000Z",
        name: "Nike Air Jordan 1 Mid",
        brand: "Nike",
        images: [
            "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800",
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
            "https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=800",
            "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800"
        ],
        price: 11999,
        categories: ["Basketball", "Casual"],
        description: "{\"productDescription\":\"The Nike Air Jordan 1 Mid delivers iconic style with a modern twist. Featuring premium materials and the classic Air Jordan design, these sneakers are perfect for both on-court performance and street style.\",\"productDetails\":\"• Brand: Nike\\n• Category: Basketball Shoes, Streetwear\\n• Upper Material: Leather and synthetic\\n• Midsole: Air-Sole cushioning\\n• Outsole: Solid rubber with pivot points\\n• Closure: Lace-up\\n• Available Sizes: 7, 8, 9, 10, 11, 12\\n• Color Options: Chicago, Bred, Royal Blue\",\"careInstructions\":\"• Clean with soft cloth\\n• Use sneaker cleaner for deep cleaning\\n• Air dry only\\n• Avoid extreme temperatures\"}",
        product_type: "variable",
        variations: [
            { id: "1", name: "Size 8", price: 11999, stock: 10, is_default: true },
            { id: "2", name: "Size 9", price: 11999, stock: 12 },
            { id: "3", name: "Size 10", price: 11999, stock: 8 },
            { id: "4", name: "Size 11", price: 11999, stock: 6 },
        ],
    },
    {
        id: 8,
        created_at: "2026-03-14T14:00:00.000Z",
        name: "Adidas NMD R1",
        brand: "Adidas",
        images: [
            "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800",
            "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800",
            "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800"
        ],
        price: 10999,
        categories: ["Casual", "Lifestyle"],
        description: "{\"productDescription\":\"The Adidas NMD R1 blends heritage with modern innovation. Featuring responsive Boost cushioning and a sleek, sock-like fit, these shoes provide exceptional comfort for urban exploration and everyday wear.\",\"productDetails\":\"• Brand: Adidas\\n• Category: Lifestyle Sneakers\\n• Upper Material: Primeknit textile\\n• Midsole: Boost technology with signature plugs\\n• Outsole: Rubber\\n• Closure: Lace-up\\n• Available Sizes: 7, 8, 9, 10, 11\\n• Color Options: Core Black, White/Blue, Grey/Red\",\"careInstructions\":\"• Clean with damp cloth\\n• Mild soap for stains\\n• Air dry at room temperature\\n• Avoid direct sunlight\"}",
        product_type: "variable",
        variations: [
            { id: "1", name: "Size 8", price: 10999, stock: 18, is_default: true },
            { id: "2", name: "Size 9", price: 10999, stock: 22 },
            { id: "3", name: "Size 10", price: 10999, stock: 15 },
        ],
    },
    {
        id: 9,
        created_at: "2026-03-14T13:00:00.000Z",
        name: "Puma Cali Sport",
        brand: "Puma",
        in_stock: false,
        images: [
            "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=800",
            "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800",
            "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800"
        ],
        price: 8499,
        categories: ["Casual", "Lifestyle"],
        description: "{\"productDescription\":\"The Puma Cali Sport brings West Coast vibes to your sneaker collection. With its bold design and comfortable fit, this shoe is perfect for making a fashion statement while staying comfortable all day long.\",\"productDetails\":\"• Brand: Puma\\n• Category: Lifestyle Sneakers, Fashion\\n• Upper Material: Leather and synthetic\\n• Midsole: CMEVA midsole\\n• Outsole: Rubber with unique tread pattern\\n• Closure: Lace-up\\n• Available Sizes: 6, 7, 8, 9, 10, 11\\n• Color Options: White/Black, Pink/White, Blue/White\",\"careInstructions\":\"• Wipe clean with damp cloth\\n• Use mild detergent for cleaning\\n• Air dry naturally\\n• Keep away from heat sources\"}",
        product_type: "variable",
        variations: [
            { id: "1", name: "Size 8", price: 8499, stock: 20, is_default: true },
            { id: "2", name: "Size 9", price: 8499, stock: 24 },
            { id: "3", name: "Size 10", price: 8499, stock: 18 },
        ],
    },
    {
        id: 10,
        created_at: "2026-03-14T12:00:00.000Z",
        name: "Nike Pegasus 39",
        brand: "Nike",
        images: [
            "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800",
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
            "https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=800",
            "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800"
        ],
        price: 10499,
        categories: ["Running", "Sports"],
        description: "{\"productDescription\":\"The Nike Pegasus 39 is a versatile running shoe that delivers responsive cushioning for your daily runs. With its trusted fit and feel, the Pegasus continues to be a favorite among runners of all levels.\",\"productDetails\":\"• Brand: Nike\\n• Category: Running Shoes\\n• Upper Material: Engineered mesh\\n• Midsole: React foam with Air Zoom units\\n• Outsole: Waffle-inspired rubber\\n• Closure: Lace-up\\n• Available Sizes: 7, 8, 9, 10, 11, 12\\n• Color Options: Black/White, Blue/Orange, Grey/Pink\",\"careInstructions\":\"• Clean with soft brush\\n• Use mild soap and water\\n• Air dry completely\\n• Replace when cushioning wears out\"}",
        product_type: "variable",
        variations: [
            { id: "1", name: "Size 8", price: 10499, stock: 14, is_default: true },
            { id: "2", name: "Size 9", price: 10499, stock: 18 },
            { id: "3", name: "Size 10", price: 10499, stock: 16 },
            { id: "4", name: "Size 11", price: 10499, stock: 10 },
        ],
    },
    {
        id: 11,
        created_at: "2026-03-14T11:00:00.000Z",
        name: "Adidas Superstar",
        brand: "Adidas",
        images: [
            "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800",
            "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800",
            "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800",
            "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800"
        ],
        price: 7499,
        categories: ["Casual", "Lifestyle"],
        description: "{\"productDescription\":\"The Adidas Superstar is an iconic sneaker that has transcended generations. With its signature shell toe and classic 3-Stripes design, this shoe is a cultural icon that continues to influence fashion and streetwear.\",\"productDetails\":\"• Brand: Adidas\\n• Category: Lifestyle Sneakers, Classic\\n• Upper Material: Leather\\n• Midsole: Rubber cupsole\\n• Outsole: Rubber shell toe\\n• Closure: Lace-up\\n• Available Sizes: 6, 7, 8, 9, 10, 11, 12\\n• Color Options: White/Black, All Black, White/Gold\",\"careInstructions\":\"• Clean with leather cleaner\\n• Wipe with damp cloth\\n• Air dry at room temperature\\n• Use shoe trees to maintain shape\"}",
        product_type: "variable",
        variations: [
            { id: "1", name: "Size 8", price: 7499, stock: 32, is_default: true },
            { id: "2", name: "Size 9", price: 7499, stock: 38 },
            { id: "3", name: "Size 10", price: 7499, stock: 28 },
            { id: "4", name: "Size 11", price: 7499, stock: 24 },
        ],
    },
    {
        id: 12,
        created_at: "2026-03-14T10:00:00.000Z",
        name: "Puma Future Rider",
        brand: "Puma",
        images: [
            "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800",
            "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800",
            "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800",
            "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=800"
        ],
        price: 7999,
        categories: ["Casual", "Lifestyle"],
        description: "{\"productDescription\":\"The Puma Future Rider combines retro running style with modern comfort. Featuring bold colors and a sleek silhouette, this shoe is perfect for those who want to stand out while enjoying all-day comfort.\",\"productDetails\":\"• Brand: Puma\\n• Category: Lifestyle Sneakers, Retro\\n• Upper Material: Nylon and suede\\n• Midsole: Federbein cushioning\\n• Outsole: Rubber\\n• Closure: Lace-up\\n• Available Sizes: 7, 8, 9, 10, 11\\n• Color Options: White/Multi, Black/Yellow, Grey/Blue\",\"careInstructions\":\"• Clean with soft brush\\n• Use sneaker cleaner for best results\\n• Air dry in shade\\n• Avoid machine washing\"}",
        product_type: "variable",
        variations: [
            { id: "1", name: "Size 8", price: 7999, stock: 22, is_default: true },
            { id: "2", name: "Size 9", price: 7999, stock: 26 },
            { id: "3", name: "Size 10", price: 7999, stock: 20 },
        ],
    },
];

// Cache-busting timestamp - update this when you modify products data
export const DATA_VERSION = Date.now(); // Updated all addresses to Toronto, Canada

// Helper: get all products sorted by created_at descending (mimics the Supabase query)
export function getAllProducts(): Product[] {
    return [...products].sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
    });
}

// Helper: get a single product by ID
export function getProductById(id: string | number): Product | undefined {
    return products.find(p => p.id.toString() === id.toString());
}
