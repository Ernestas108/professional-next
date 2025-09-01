"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";

const fmt = new Intl.NumberFormat("lt-LT", { style: "currency", currency: "EUR" });

export default function CheckoutPage() {
    const router = useRouter();
    const { items, inc, dec, remove, clear, subtotal } = useCart();

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        // čia būtų siuntimas į backend; dabar – demo:
        clear();
        router.push("/thanks");
    }

    return (
        <div className="mx-auto max-w-6xl px-4 py-8">
            <nav className="text-sm text-slate-500 mb-6">
                <Link href="/" className="hover:underline">Parduotuvė</Link> <span>›</span> <span>Apmokėjimas</span>
            </nav>

            <h1 className="text-2xl font-semibold mb-6">Apmokėjimas</h1>

            {items.length === 0 ? (
                <div className="rounded-xl border p-6 bg-white">
                    <p>Krepšelis tuščias.</p>
                    <Link href="/" className="mt-4 inline-block px-4 py-2 rounded-md border bg-white hover:bg-slate-50">Grįžti į parduotuvę</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Suvestinė */}
                    <section className="lg:col-span-3 rounded-xl border bg-white p-4">
                        <h2 className="font-semibold mb-3">Jūsų prekės</h2>
                        <ul className="space-y-3">
                            {items.map((it) => (
                                <li key={it.id} className="flex items-center gap-3 border rounded-lg p-2">
                                    <img src={it.img} alt={it.title} className="w-16 h-16 rounded object-cover" />
                                    <div className="min-w-0 flex-1">
                                        <div className="text-sm font-medium line-clamp-2">{it.title}</div>
                                        <div className="text-xs text-slate-500">{fmt.format(it.price)}</div>
                                        <div className="mt-2 flex items-center gap-2">
                                            <button onClick={() => dec(it.id)} className="w-7 h-7 rounded border">–</button>
                                            <span className="w-6 text-center text-sm">{it.qty}</span>
                                            <button onClick={() => inc(it.id)} className="w-7 h-7 rounded border">+</button>
                                            <button onClick={() => remove(it.id)} className="ml-auto text-xs px-2 py-1 rounded border">Pašalinti</button>
                                        </div>
                                    </div>
                                    <div className="w-20 text-right font-semibold">{fmt.format(it.qty * it.price)}</div>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Forma + sumos */}
                    <section className="lg:col-span-2 space-y-4">
                        <div className="rounded-xl border bg-white p-4">
                            <h2 className="font-semibold mb-3">Suvestinė</h2>
                            <div className="flex items-center justify-between text-sm">
                                <span>Tarpinė suma</span>
                                <span>{fmt.format(subtotal)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm mt-1">
                                <span>Pristatymas</span>
                                <span>0,00 €</span>
                            </div>
                            <hr className="my-3" />
                            <div className="flex items-center justify-between font-semibold">
                                <span>Viso</span>
                                <span>{fmt.format(subtotal)}</span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="rounded-xl border bg-white p-4 space-y-3">
                            <h2 className="font-semibold">Pirkėjo duomenys</h2>
                            <input className="w-full px-3 py-2 rounded-md border" name="name" placeholder="Vardas, pavardė" required />
                            <input className="w-full px-3 py-2 rounded-md border" name="email" type="email" placeholder="El. paštas" required />
                            <input className="w-full px-3 py-2 rounded-md border" name="phone" type="tel" placeholder="Telefonas" required />
                            <input className="w-full px-3 py-2 rounded-md border" name="address" placeholder="Adresas" required />
                            <div className="grid grid-cols-2 gap-2">
                                <input className="px-3 py-2 rounded-md border" name="city" placeholder="Miestas" required />
                                <input className="px-3 py-2 rounded-md border" name="zip" placeholder="Pašto kodas" required />
                            </div>

                            <button type="submit" className="w-full px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white">
                                Pateikti užsakymą
                            </button>
                            <p className="text-xs text-slate-500">
                                Pateikdami užsakymą, sutinkate su sąlygomis.
                            </p>
                        </form>
                    </section>
                </div>
            )}
        </div>
    );
}
