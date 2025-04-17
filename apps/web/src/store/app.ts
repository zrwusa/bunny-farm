export type Product = {
    id?: string;
    name: string;
    price: number;
    brand: {
        name: string; // Brand Name
        description?: string; // Brand description
    };
    description: unknown;
    variants: {
        name: string,
        sku: string,
        prices: {
            price: number
        }[]
    }[]
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