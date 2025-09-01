export default function ThanksPage() {
    return (
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
            <h1 className="text-3xl font-semibold">Ačiū! Užsakymas gautas 🎉</h1>
            <p className="mt-3 text-slate-600">Patvirtinimą išsiųsime el. paštu.</p>
            <a
                href="/"
                className="mt-8 inline-block px-4 py-2 rounded-md border border-slate-300 bg-white hover:bg-slate-50"
            >
                Grįžti į parduotuvę
            </a>
        </div>
    );
}
