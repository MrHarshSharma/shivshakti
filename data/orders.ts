export interface OrderItem {
    id: string
    name: string
    price: number
    quantity: number
    category: string
    image?: string
}

export interface Order {
    id: number
    name: string
    email?: string
    phone: string
    address: string
    status: string
    payment_status: string
    razorpay_order_id: string
    razorpay_payment_id: string
    order: {
        total: number
        itemCount: number
        items: OrderItem[]
    }
    created_at: string
}

// Dummy orders data
export const dummyOrders: Order[] = [
    {
        id: 1,
        name: "John Smith",
        email: "john.smith@email.com",
        phone: "+1 416 555 0101",
        address: "123 King Street West, Toronto, ON M5H 1A1, Canada",
        status: "delivered",
        payment_status: "paid",
        razorpay_order_id: "order_ORD001",
        razorpay_payment_id: "pay_PAY001",
        order: {
            total: 12999,
            itemCount: 1,
            items: [
                {
                    id: "1",
                    name: "Nike Air Max 270",
                    price: 12999,
                    quantity: 1,
                    category: "Running",
                    image: "https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=800"
                }
            ]
        },
        created_at: "2026-03-10T10:30:00.000Z"
    },
    {
        id: 2,
        name: "Sarah Johnson",
        email: "sarah.j@email.com",
        phone: "+1 416 555 0102",
        address: "456 Queen Street East, Toronto, ON M5A 1S9, Canada",
        status: "shipped",
        payment_status: "paid",
        razorpay_order_id: "order_ORD002",
        razorpay_payment_id: "pay_PAY002",
        order: {
            total: 15999,
            itemCount: 1,
            items: [
                {
                    id: "2",
                    name: "Adidas Ultraboost 22",
                    price: 15999,
                    quantity: 1,
                    category: "Running",
                    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800"
                }
            ]
        },
        created_at: "2026-03-11T14:20:00.000Z"
    },
    {
        id: 3,
        name: "Michael Brown",
        email: "michael.brown@email.com",
        phone: "+1 416 555 0103",
        address: "789 Yonge Street, Toronto, ON M4Y 2B2, Canada",
        status: "confirmed",
        payment_status: "paid",
        razorpay_order_id: "order_ORD003",
        razorpay_payment_id: "pay_PAY003",
        order: {
            total: 19998,
            itemCount: 2,
            items: [
                {
                    id: "3",
                    name: "Puma RS-X Efekt",
                    price: 9999,
                    quantity: 2,
                    category: "Casual",
                    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800"
                }
            ]
        },
        created_at: "2026-03-12T09:15:00.000Z"
    },
    {
        id: 4,
        name: "Emily Davis",
        email: "emily.davis@email.com",
        phone: "+1 416 555 0104",
        address: "321 Dundas Street West, Toronto, ON M5T 1G5, Canada",
        status: "pending",
        payment_status: "paid",
        razorpay_order_id: "order_ORD004",
        razorpay_payment_id: "pay_PAY004",
        order: {
            total: 27998,
            itemCount: 2,
            items: [
                {
                    id: "4",
                    name: "Nike React Infinity Run",
                    price: 13999,
                    quantity: 2,
                    category: "Running",
                    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800"
                }
            ]
        },
        created_at: "2026-03-13T11:45:00.000Z"
    },
    {
        id: 5,
        name: "David Wilson",
        email: "david.wilson@email.com",
        phone: "+1 416 555 0105",
        address: "654 College Street, Toronto, ON M6G 1B4, Canada",
        status: "delivered",
        payment_status: "paid",
        razorpay_order_id: "order_ORD005",
        razorpay_payment_id: "pay_PAY005",
        order: {
            total: 7999,
            itemCount: 1,
            items: [
                {
                    id: "5",
                    name: "Adidas Stan Smith",
                    price: 7999,
                    quantity: 1,
                    category: "Casual",
                    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800"
                }
            ]
        },
        created_at: "2026-03-09T16:30:00.000Z"
    },
    {
        id: 6,
        name: "Jessica Martinez",
        email: "jessica.m@email.com",
        phone: "+1 416 555 0106",
        address: "987 Bloor Street West, Toronto, ON M6H 1L7, Canada",
        status: "shipped",
        payment_status: "paid",
        razorpay_order_id: "order_ORD006",
        razorpay_payment_id: "pay_PAY006",
        order: {
            total: 37996,
            itemCount: 3,
            items: [
                {
                    id: "7",
                    name: "Nike Air Jordan 1 Mid",
                    price: 11999,
                    quantity: 2,
                    category: "Basketball",
                    image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800"
                },
                {
                    id: "4",
                    name: "Nike React Infinity Run",
                    price: 13999,
                    quantity: 1,
                    category: "Running",
                    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800"
                }
            ]
        },
        created_at: "2026-03-11T08:20:00.000Z"
    },
    {
        id: 7,
        name: "Robert Taylor",
        email: "robert.taylor@email.com",
        phone: "+1 416 555 0107",
        address: "147 Harbord Street, Toronto, ON M5S 1H2, Canada",
        status: "confirmed",
        payment_status: "paid",
        razorpay_order_id: "order_ORD007",
        razorpay_payment_id: "pay_PAY007",
        order: {
            total: 10999,
            itemCount: 1,
            items: [
                {
                    id: "8",
                    name: "Adidas NMD R1",
                    price: 10999,
                    quantity: 1,
                    category: "Lifestyle",
                    image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800"
                }
            ]
        },
        created_at: "2026-03-12T13:50:00.000Z"
    },
    {
        id: 8,
        name: "Linda Anderson",
        email: "linda.a@email.com",
        phone: "+1 416 555 0108",
        address: "258 Spadina Avenue, Toronto, ON M5T 2E2, Canada",
        status: "cancelled",
        payment_status: "refunded",
        razorpay_order_id: "order_ORD008",
        razorpay_payment_id: "pay_PAY008",
        order: {
            total: 6999,
            itemCount: 1,
            items: [
                {
                    id: "6",
                    name: "Puma Suede Classic",
                    price: 6999,
                    quantity: 1,
                    category: "Casual",
                    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800"
                }
            ]
        },
        created_at: "2026-03-08T15:10:00.000Z"
    },
    {
        id: 9,
        name: "Christopher Lee",
        email: "chris.lee@email.com",
        phone: "+1 416 555 0109",
        address: "369 Richmond Street West, Toronto, ON M5V 1X1, Canada",
        status: "pending",
        payment_status: "paid",
        razorpay_order_id: "order_ORD009",
        razorpay_payment_id: "pay_PAY009",
        order: {
            total: 25998,
            itemCount: 2,
            items: [
                {
                    id: "1",
                    name: "Nike Air Max 270",
                    price: 12999,
                    quantity: 2,
                    category: "Running",
                    image: "https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=800"
                }
            ]
        },
        created_at: "2026-03-14T10:00:00.000Z"
    },
    {
        id: 10,
        name: "Amanda White",
        email: "amanda.white@email.com",
        phone: "+1 416 555 0110",
        address: "741 Bay Street, Toronto, ON M5G 2R1, Canada",
        status: "delivered",
        payment_status: "paid",
        razorpay_order_id: "order_ORD010",
        razorpay_payment_id: "pay_PAY010",
        order: {
            total: 8499,
            itemCount: 1,
            items: [
                {
                    id: "9",
                    name: "Puma Cali Sport",
                    price: 8499,
                    quantity: 1,
                    category: "Casual",
                    image: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=800"
                }
            ]
        },
        created_at: "2026-03-07T12:30:00.000Z"
    }
]

export const getAllOrders = () => {
    return dummyOrders
}

export const getOrderById = (id: number) => {
    return dummyOrders.find(order => order.id === id)
}

export const getOrdersByStatus = (status: string) => {
    if (status === 'all') return dummyOrders
    return dummyOrders.filter(order => order.status === status)
}

export const searchOrders = (searchTerm: string) => {
    const term = searchTerm.toLowerCase()
    return dummyOrders.filter(order =>
        order.name.toLowerCase().includes(term) ||
        order.email?.toLowerCase().includes(term) ||
        order.phone.includes(term) ||
        order.razorpay_order_id.toLowerCase().includes(term)
    )
}
