import { Bot } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 leading-tight">
            IA vers Pronote
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Convertisseur de QCM
          </p>
        </div>
      </div>
    </header>
  );
}