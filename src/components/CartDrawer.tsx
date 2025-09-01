"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "../context/CartContext";

const fmt = new Intl.NumberFormat("lt-LT", { style: "currency", currency: "EUR" });

export default function CartDrawer() {
    const { isOpen, close, items, inc, dec, remove, clear, subtotal } = useCart();

    // užrakinti body scroll kai atidaryta
    useEffect(() => {
        if (!isOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = prev; };
    }, [isOpen]);

    return (
        <>
            {/* fonas */}
            <div
                onClick={close}
                className={`fixed inset-0 bg-black/40 transition-opacity duration-200 ${
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
            />

            {/* stalčius */}
            <aside
                className={`fixed right-0 top-0 h-full w-[360px] max-w-[90vw] bg-white shadow-2xl border-l border-slate-200
        transition-transform duration-200 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
                aria-hidden={!isOpen}
            >
                <header className="flex items-center justify-between p-4 border-b border-slate-200">
                    <h2 className="text-lg font-semibold">Krepšelis</h2>
                    <div className="flex items-center gap-2">
                        {!!items.length && (
                            <button
                                onClick={clear}
                                className="px-2 py-1 text-sm rounded-md border border-slate-300 hover:bg-slate-100"
                                title="Išvalyti krepšelį"
                            >
                                Išvalyti
                            </button>
                        )}
                        <button
                            onClick={close}
                            className="px-2 py-1 rounded-md border border-slate-300 hover:bg-slate-100"
                            aria-label="Uždaryti"
                        >
                            ✕
                        </button>
                    </div>
                </header>

                {/* prekės */}
                <div className="h-[calc(100%-160px)] overflow-auto p-3">
                    {items.length === 0 ? (
                        <p className="text-slate-600 p-4">Krepšelis tuščias.</p>
                    ) : (
                        <ul className="space-y-3">
                            {items.map((it) => (
                                <li key={it.id} className="flex gap-3 rounded-lg border border-slate-200 p-2">
                                    <img src={it.img} alt={it.title} className="w-16 h-16 object-cover rounded" loading="lazy" />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium line-clamp-2">{it.title}</p>
                                        <p className="text-xs text-slate-500">{fmt.format(it.price)}</p>
                                        <div className="mt-2 flex items-center gap-2">
                                            <button onClick={() => dec(it.id)} className="w-7 h-7 rounded border border-slate-300 hover:bg-slate-100">–</button>
                                            <span className="min-w-6 text-center text-sm">{it.qty}</span>
                                            <button onClick={() => inc(it.id)} className="w-7 h-7 rounded border border-slate-300 hover:bg-slate-100">+</button>
                                            <button onClick={() => remove(it.id)} className="ml-auto text-sm px-2 py-1 rounded border border-slate-300 hover:bg-slate-100">
                                                Pašalinti
                                            </button>
                                        </div>
                                    </div>
                                    <div className="w-16 text-right font-semibold">{fmt.format(it.qty * it.price)}</div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* apatinė juosta */}
                <footer className="p-4 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Tarpinė suma</span>
                        <span className="text-lg font-semibold">{fmt.format(subtotal)}</span>
                    </div>

                    <div className="mt-3 flex gap-2">
                        <button
                            onClick={close}
                            className="flex-1 px-3 py-2 rounded-md border border-slate-300 hover:bg-slate-100"
                        >
                            Tęsti
                        </button>
                        {/* Apmokėti → į checkout */}
                        <Link
                            href="/checkout"
                            onClick={close}
                            className="flex-1 px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-center"
                        >
                            Apmokėti
                        </Link>
                    </div>
                </footer>
            </aside>
        </>
    );
}
