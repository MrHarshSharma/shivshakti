
export interface Product {
    id: string | number;
    name: string;
    description: string;
    price: number;
    categories: string[];
    images: string[];
    isNew?: boolean;
}

// Keep the mock data for now but update structure to avoid typescrpit errors during migration
export const products: Product[] = [
    {
        id: '1',
        name: 'The Royal Indulgence Hamper',
        description: 'A majestic collection of premium treats presented in a luxurious gift box. Curated for the ultimate festive gesture.',
        price: 3500,
        categories: ['Hampers'],
        images: ['https://images.unsplash.com/photo-1759563874745-47e35c0a9572?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0'],
        isNew: true,
    },
    {
        id: '2',
        name: 'Saffron & Rose Gold Box',
        description: 'An elegant presentation of authentic Indian sweets, featuring silver-leaf kaju katli and saffron delights.',
        price: 1200,
        categories: ['Gourmet'],
        images: ['https://images.unsplash.com/photo-1695568181558-034b7d3e49eb?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0'],
    },
    {
        id: '3',
        name: 'Midnight Cocoa Selection',
        description: 'For the dark chocolate connoisseur. A flat-lay of 70% to 90% single-origin dark chocolates paired with nuts.',
        price: 950,
        categories: ['Chocolates'],
        images: ['https://images.unsplash.com/photo-1601568656042-65dc282bd537?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0'],
    },
    {
        id: '4',
        name: 'The Wellness Ritual',
        description: 'A calming spa hamper featuring organic skincare essentials and aromatherapy oil for total relaxation.',
        price: 2100,
        categories: ['Wellness'],
        images: ['https://images.unsplash.com/photo-1667869285880-4097f8b153d6?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0'],
    },
    {
        id: '5',
        name: 'Gold-Leaf Dry Fruits',
        description: 'Premium gourmet mix of dried apricots, figs, and nuts. A healthy yet opulent gift choice.',
        price: 1800,
        categories: ['Dry Fruits'],
        images: ['https://images.unsplash.com/photo-1602948750761-97ea79ee42ec?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0'],
        isNew: true,
    },
    {
        id: '6',
        name: 'Artisan Spiced Chips',
        description: 'Hand-cut gourmet potato chips served with a signature dip. The perfect savory snack.',
        price: 450,
        categories: ['Gourmet'],
        images: ['https://images.unsplash.com/photo-1658078367419-11c2cf639094?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0'],
    }
];
