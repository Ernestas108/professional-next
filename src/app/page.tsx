"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

/** ---- Tipai ir DEMO duomenys (24 vnt.) ---- */
type Product = {
  id: string;
  title: string;
  brand: string;
  cat: string;
  price: number; // EUR
  img: string;
};

const PRODUCTS: Product[] = [
  { id: "1",  title: "Belaidės ausinės Pro",         brand: "Sonic",     cat: "elektronika", price: 89,  img: "https://picsum.photos/seed/1/800/600" },
  { id: "2",  title: "Išmanus laikrodis X2",          brand: "Timeon",    cat: "elektronika", price: 129, img: "https://picsum.photos/seed/2/800/600" },
  { id: "3",  title: "Aukšto slėgio plovykla",        brand: "CleanUp",   cat: "namai",       price: 159, img: "https://picsum.photos/seed/3/800/600" },
  { id: "4",  title: "Sodo žarnos rinkinys",          brand: "Gardenix",  cat: "sodas",       price: 39,  img: "https://picsum.photos/seed/4/800/600" },
  { id: "5",  title: "Sportinė striukė",              brand: "NordFit",   cat: "sportas",     price: 69,  img: "https://picsum.photos/seed/5/800/600" },
  { id: "6",  title: "Automobilio kompresorius 50L",  brand: "AirTech",   cat: "auto",        price: 289, img: "https://picsum.photos/seed/6/800/600" },
  { id: "7",  title: "OBD2 diagnostikos skaitytuvas", brand: "DiagX",     cat: "auto",        price: 119, img: "https://picsum.photos/seed/7/800/600" },
  { id: "8",  title: "LED stalinė lempa",             brand: "Luma",      cat: "namai",       price: 24,  img: "https://picsum.photos/seed/8/800/600" },

  { id: "9",  title: "Belaidis garsiakalbis Mini",    brand: "Sonic",     cat: "elektronika", price: 49,  img: "https://picsum.photos/seed/9/800/600" },
  { id: "10", title: "Nešiojamas šaldytuvas 12V",     brand: "CoolRide",  cat: "auto",        price: 179, img: "https://picsum.photos/seed/10/800/600" },
  { id: "11", title: "Grąžtas Pro 750W",              brand: "ProTool",   cat: "namai",       price: 89,  img: "https://picsum.photos/seed/11/800/600" },
  { id: "12", title: "Sodo purkštuvas 5L",            brand: "Gardenix",  cat: "sodas",       price: 29,  img: "https://picsum.photos/seed/12/800/600" },
  { id: "13", title: "Miestinis dviratis CityRide",   brand: "CityRide",  cat: "sportas",     price: 399, img: "https://picsum.photos/seed/13/800/600" },
  { id: "14", title: "Bėgimo bateliai Sprint",        brand: "NordFit",   cat: "sportas",     price: 79,  img: "https://picsum.photos/seed/14/800/600" },
  { id: "15", title: "Veiksmo kamera 4K",             brand: "VisionX",   cat: "elektronika", price: 219, img: "https://picsum.photos/seed/15/800/600" },
  { id: "16", title: "Projektorius HD",               brand: "Luma",      cat: "elektronika", price: 199, img: "https://picsum.photos/seed/16/800/600" },

  { id: "17", title: "Oro valytuvas",                 brand: "CleanAir",  cat: "namai",       price: 149, img: "https://picsum.photos/seed/17/800/600" },
  { id: "18", title: "Kavavirė Barista",              brand: "Barista",   cat: "namai",       price: 109, img: "https://picsum.photos/seed/18/800/600" },
  { id: "19", title: "Smart TV 43\"",                 brand: "ViewIt",    cat: "elektronika", price: 329, img: "https://picsum.photos/seed/19/800/600" },
  { id: "20", title: "Mikrofono rinkinys",            brand: "SoundLab",  cat: "elektronika", price: 99,  img: "https://picsum.photos/seed/20/800/600" },
  { id: "21", title: "Automobilinė kamera",           brand: "RoadEye",   cat: "auto",        price: 89,  img: "https://picsum.photos/seed/21/800/600" },
  { id: "22", title: "Krepšinio kamuolys",            brand: "Arena",     cat: "sportas",     price: 25,  img: "https://picsum.photos/seed/22/800/600" },
  { id: "23", title: "Šiltnamio plėvelė 3×6 m",       brand: "Gardenix",  cat: "sodas",       price: 119, img: "https://picsum.photos/seed/23/800/600" },
  { id: "24", title: "Multimetras Pro",               brand: "ProTool",   cat: "elektronika", price: 39,  img: "https://picsum.photos/seed/24/800/600" }
];

/** ---- Valiuta ---- */
type Currency = "EUR" | "USD" | "GBP" | "PLN" | "SEK" | "NOK";
const RATES: Record<Currency, number> = {
  EUR: 1,
  USD: 1.09,
  GBP: 0.85,
  PLN: 4.3,
  SEK: 11.4,
  NOK: 11.6,
};
const formatMoney = (eurAmount: number, cur: Currency) =>
    new Intl.NumberFormat("lt-LT", { style: "currency", currency: cur }).format(
        eurAmount * RATES[cur]
    );

/** ---- „Kieta“ paieška + filtrai + rikiavimas ---- */
const norm = (s: string) =>
    s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const tokenize = (q: string) =>
    Array.from(new Set(norm(q).split(/[^a-z0-9]+/).filter(Boolean)));

type Scored = Product & {
  _score: number;
  _hits: { title: boolean; brand: boolean; cat: boolean };
};

function scoreProduct(p: Product, tokens: string[]): Scored | null {
  const t = { title: norm(p.title), brand: norm(p.brand), cat: norm(p.cat) };
  if (tokens.length === 0)
    return { ...p, _score: 0, _hits: { title: false, brand: false, cat: false } };

  let score = 0;
  const hits = { title: false, brand: false, cat: false };

  for (const tok of tokens) {
    const starts = new RegExp(`\\b${tok}`);
    if (starts.test(t.title)) { score += 9; hits.title = true; }
    else if (t.title.includes(tok)) { score += 5; hits.title = true; }

    if (starts.test(t.brand)) { score += 6; hits.brand = true; }
    else if (t.brand.includes(tok)) { score += 3; hits.brand = true; }

    if (starts.test(t.cat)) { score += 3; hits.cat = true; }
    else if (t.cat.includes(tok)) { score += 2; hits.cat = true; }
  }

  if (score === 0) return null;
  const fieldsHit = Number(hits.title) + Number(hits.brand) + Number(hits.cat);
  score += fieldsHit >= 2 ? 2 : 0;
  return { ...p, _score: score, _hits: hits };
}

/** ---- Filtrų būsena ---- */
type FiltersState = {
  cat: string;
  brand: string;
  min: string; // kaina nuo (EUR)
  max: string; // kaina iki (EUR)
  sort: "pop" | "price-asc" | "price-desc" | "title";
};

/** ---- Puslapis ---- */
export default function Page() {
  const [q, setQ] = useState("");
  const [filters, setFilters] = useState<FiltersState>({
    cat: "",
    brand: "",
    min: "",
    max: "",
    sort: "pop",
  });

  // Valiuta
  const [currency, setCurrency] = useState<Currency>("EUR");

  // PAGINACIJA
  const PAGE_SIZE = 12;
  const [page, setPage] = useState(1);
  useEffect(() => { setPage(1); }, [q, filters]);

  const tokens = useMemo(() => tokenize(q), [q]);
  const cats = useMemo(() => Array.from(new Set(PRODUCTS.map(p => p.cat))), []);
  const brands = useMemo(() => Array.from(new Set(PRODUCTS.map(p => p.brand))), []);

  // 1) paieška + 2) filtrai + 3) rikiavimas
  const items: Scored[] = useMemo(() => {
    const scored: Scored[] = [];
    for (const p of PRODUCTS) {
      const s = scoreProduct(p, tokens);
      if (s) scored.push(s);
    }

    let res = scored;
    if (filters.cat)   res = res.filter(p => p.cat === filters.cat);
    if (filters.brand) res = res.filter(p => p.brand === filters.brand);

    const min = filters.min.trim() === "" ? null : Number(filters.min);
    const max = filters.max.trim() === "" ? null : Number(filters.max);
    if (min !== null && !Number.isNaN(min)) res = res.filter(p => p.price >= min);
    if (max !== null && !Number.isNaN(max)) res = res.filter(p => p.price <= max);

    res = res.slice();
    res.sort((a, b) => {
      switch (filters.sort) {
        case "price-asc":  return a.price - b.price || a.title.localeCompare(b.title);
        case "price-desc": return b.price - a.price || a.title.localeCompare(b.title);
        case "title":      return a.title.localeCompare(b.title);
        default:           return b._score - a._score || a.price - b.price || a.title.localeCompare(b.title);
      }
    });
    return res;
  }, [tokens, filters]);

  // 4) puslapiavimas
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const startIdx = (page - 1) * PAGE_SIZE;
  const pageItems = items.slice(startIdx, startIdx + PAGE_SIZE);

  return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/85 backdrop-blur border-b border-slate-200">
          <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
            <Link href="/" className="font-bold text-lg tracking-wide">
              professional<span className="text-blue-600">-next</span>
            </Link>

            {/* ← Į GitHub portfolio (NAUJAS MYGTUKAS) */}
            <a
                href="https://ernestas108.github.io/portfolio/#"
                className="px-3 py-1.5 rounded-md border border-slate-300 hover:bg-slate-100"
                title="Grįžti į GitHub portfolio"
            >
              ← Į portfolio
            </a>

            {/* Kategorijos (dropdown) */}
            <details className="relative">
              <summary className="list-none cursor-pointer px-3 py-1.5 rounded-md border border-slate-300 hover:bg-slate-100">
                Kategorijos
              </summary>
              <div className="absolute left-0 mt-2 w-64 rounded-lg border border-slate-200 bg-white shadow-xl p-2">
                <ul className="grid grid-cols-1">
                  {cats.map((c) => (
                      <li key={c}>
                        <button
                            className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-100"
                            onClick={() => setFilters(s => ({ ...s, cat: c }))}
                        >
                          {c}
                        </button>
                      </li>
                  ))}
                </ul>
              </div>
            </details>

            {/* Paieška */}
            <form className="ml-2 flex-1 hidden md:flex" action="#" onSubmit={(e) => e.preventDefault()}>
              <input
                  name="q"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Ieškok prekių, brandų ar kategorijų…"
                  className="flex-1 px-3 py-2 rounded-l-md border border-slate-300 bg-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                  type="submit"
                  className="px-4 py-2 rounded-r-md border border-l-0 border-slate-300 bg-blue-600 hover:bg-blue-500 text-white"
                  aria-label="Ieškoti"
              >
                🔎
              </button>
            </form>

            {/* Valiuta */}
            <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="px-3 py-2 rounded-md border border-slate-300 bg-white"
                title="Valiuta"
            >
              {(["EUR","USD","GBP","PLN","SEK","NOK"] as Currency[]).map((c) => (
                  <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </header>

        {/* Turinys */}
        <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <h1 className="text-2xl font-semibold">Katalogas</h1>
            <p className="text-slate-600 mt-2">
              Rasta: <b>{total}</b>. Rodoma {total ? `${startIdx + 1}–${Math.min(total, startIdx + pageItems.length)}` : "0"}.
            </p>
            <p className="text-slate-500 text-sm mt-1">Filtras „Kaina nuo/iki“ taikomas EUR bazei.</p>
          </section>

          {/* FILTRŲ JUOSTA */}
          <section className="grid grid-cols-1 md:grid-cols-7 gap-2 rounded-xl border border-slate-200 bg-white p-3">
            <select
                value={filters.cat}
                onChange={(e) => setFilters(s => ({ ...s, cat: e.target.value }))}
                className="px-3 py-2 rounded-md border border-slate-300 bg-white"
                title="Kategorija"
            >
              <option value="">Visos kategorijos</option>
              {cats.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>

            <select
                value={filters.brand}
                onChange={(e) => setFilters(s => ({ ...s, brand: e.target.value }))}
                className="px-3 py-2 rounded-md border border-slate-300 bg-white"
                title="Brandas"
            >
              <option value="">Visi brandai</option>
              {brands.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>

            <input
                type="number"
                inputMode="numeric"
                placeholder="Kaina nuo (EUR)"
                value={filters.min}
                onChange={(e) => setFilters(s => ({ ...s, min: e.target.value }))}
                className="px-3 py-2 rounded-md border border-slate-300 bg-white"
            />
            <input
                type="number"
                inputMode="numeric"
                placeholder="Kaina iki (EUR)"
                value={filters.max}
                onChange={(e) => setFilters(s => ({ ...s, max: e.target.value }))}
                className="px-3 py-2 rounded-md border border-slate-300 bg-white"
            />

            <select
                value={filters.sort}
                onChange={(e) => setFilters(s => ({ ...s, sort: e.target.value as FiltersState["sort"] }))}
                className="px-3 py-2 rounded-md border border-slate-300 bg-white"
                title="Rūšiavimas"
            >
              <option value="pop">Pagal aktualumą</option>
              <option value="price-asc">Kaina ↑</option>
              <option value="price-desc">Kaina ↓</option>
              <option value="title">Pavadinimas A→Ž</option>
            </select>

            <button
                onClick={() => { setFilters({ cat: "", brand: "", min: "", max: "", sort: "pop" }); setQ(""); setPage(1); }}
                className="px-3 py-2 rounded-md border border-slate-300 bg-slate-50 hover:bg-slate-100"
                title="Išvalyti"
            >
              Išvalyti
            </button>
          </section>

          {/* Rezultatai (puslapis) */}
          {pageItems.length ? (
              <>
                <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {pageItems.map((p) => (
                      <div key={p.id} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                        <img src={p.img} alt={p.title} className="w-full h-44 object-cover" loading="lazy" />
                        <div className="p-3 space-y-1.5">
                          <h3 className="text-sm font-semibold line-clamp-2">{p.title}</h3>
                          <p className="text-xs text-slate-500">{p.brand} • {p.cat}</p>
                          <p className="text-blue-700 font-bold">{formatMoney(p.price, currency)}</p>
                        </div>
                      </div>
                  ))}
                </section>

                {/* Puslapiavimas */}
                <section className="flex items-center justify-between mt-2">
                  <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-3 py-1.5 rounded-md border border-slate-300 bg-white disabled:opacity-40"
                  >
                    ‹ Ankstesnis
                  </button>

                  <div className="flex flex-wrap gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                        <button
                            key={n}
                            onClick={() => setPage(n)}
                            className={`px-3 py-1.5 rounded-md border ${
                                n === page
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-white border-slate-300 hover:bg-slate-100"
                            }`}
                        >
                          {n}
                        </button>
                    ))}
                  </div>

                  <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-3 py-1.5 rounded-md border border-slate-300 bg-white disabled:opacity-40"
                  >
                    Kitas ›
                  </button>
                </section>
              </>
          ) : (
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                Nieko nerasta.
              </div>
          )}
        </main>
      </div>
  );
}
