export interface List {
    items: Item[],
    id: string | null,
    title: string | null,
    price: number | null,
    noArticle: number | null,
};

export interface Item {
    id: string,
    description: string | null,
    price: number | null,
    check: boolean,
};
