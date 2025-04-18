export type Product = {
    id: string;
    name: string;
    price: number;
    description?: any;
    brand?: {
        id: string;
        name: string;
    };
    category?: {
        id: string;
        name: string;
    };
    images: Array<{
        id: string;
        url: string;
        position?: number;
    }>;
    variants: Array<{
        id: string;
        size: string;
        sku: string;
        color: string;
        prices: Array<{
            price: number;
        }>;
    }>;
}

export type User = {
    id: string;
    username: string;
    provider: string;
    settings: {
        userId: string
        receiveEmails: boolean
        receiveNotifications: boolean
    };
    posts: {
        id: string;
        title: string;
        content: string
    }[]
}