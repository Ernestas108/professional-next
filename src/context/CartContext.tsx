"use client";

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";

/** Perkamų prekių tipas (pakanka šių laukų) */
export type Buyable = { id: string; title: string; price: number; img: string };

type CartItem = Buyable & { qty: number };

type Ctx = {
    items: CartItem[];
    isOpen: boolean;
    open: () => void;
    close: () => void;
    add: (p: Buyable, qty?: number) => void;
    inc: (id: string) => void;
    dec: (id: string) => void;
    remove: (id: string) => void;
    clear: () => void;
    count: number;
    subtotal: number; // EUR
};

const CartContext = createContext<Ctx | null>(null);
export const useCart = () => {
    const v = useContext(CartContext);
    if (!v) throw new Error("useCart must be used inside <CartProvider>");
    return v;
};

const LS_KEY = "cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setOpen] = useState(false);

    // įkeliame iš localStorage (jei yra)
    useEffect(() => {
        try {
            const raw = localStorage.getItem(LS_KEY);
            if (raw) setItems(JSON.parse(raw));
        } catch {}
    }, []);

    // išsaugome į localStorage
    useEffect(() => {
        try {
            localStorage.setItem(LS_KEY, JSON.stringify(items));
        } catch {}
    }, [items]);

    const add = (p: Buyable, qty = 1) => {
        setItems((list) => {
            const i = list.findIndex((x) => x.id === p.id);
            if (i >= 0) {
                const copy = list.slice();
                copy[i] = { ...copy[i], qty: copy[i].qty + qty };
                return copy;
            }
            return [...list, { ...p, qty }];
        });
    };

    const inc = (id: string) =>
        setItems((l) => l.map((x) => (x.id === id ? { ...x, qty: x.qty + 1 } : x)));

    const dec = (id: string) =>
        setItems((l) =>
            l
                .map((x) => (x.id === id ? { ...x, qty: x.qty - 1 } : x))
                .filter((x) => x.qty > 0)
        );

    const remove = (id: string) => setItems((l) => l.filter((x) => x.id !== id));
    const clear = () => setItems([]);

    const count = useMemo(() => items.reduce((s, x) => s + x.qty, 0), [items]);
    const subtotal = useMemo(() => items.reduce((s, x) => s + x.qty * x.price, 0), [items]);

    const value: Ctx = {
        items,
        isOpen,
        open: () => setOpen(true),
        close: () => setOpen(false),
        add,
        inc,
        dec,
        remove,
        clear,
        count,
        subtotal,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
