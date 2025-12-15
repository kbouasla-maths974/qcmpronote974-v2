export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-sm text-slate-500">
          Outil gratuit pour les enseignants.
        </p>
        <div className="flex gap-4 text-sm text-slate-500">
          <span>Compatible Pronote & Moodle</span>
        </div>
      </div>
    </footer>
  );
}