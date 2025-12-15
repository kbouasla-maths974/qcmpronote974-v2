import { Eraser, FileText } from 'lucide-react';

interface EditorSectionProps {
  metadata: { name: string; niveau: string; matiere: string };
  setMetadata: (data: any) => void;
  inputText: string;
  setInputText: (text: string) => void;
}

export function EditorSection({ metadata, setMetadata, inputText, setInputText }: EditorSectionProps) {
  
  const handleChange = (field: string, value: string) => {
    setMetadata({ ...metadata, [field]: value });
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* --- Bloc Métadonnées --- */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600" />
          Informations du QCM
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Titre du QCM</label>
            <input
              type="text"
              value={metadata.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="Ex: Évaluation Chapitre 1"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Niveau</label>
            <input
              type="text"
              value={metadata.niveau}
              onChange={(e) => handleChange('niveau', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="Ex: 3EME"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Matière</label>
            <input
              type="text"
              value={metadata.matiere}
              onChange={(e) => handleChange('matiere', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="Ex: Histoire"
            />
          </div>
        </div>
      </div>

      {/* --- Bloc Zone de Texte --- */}
      <div className="flex-1 bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col min-h-[500px]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-slate-900">Contenu généré par l'IA</h3>
          {inputText && (
            <button
              onClick={() => setInputText('')}
              className="text-xs flex items-center gap-1 text-slate-400 hover:text-red-500 transition-colors"
            >
              <Eraser className="w-3 h-3" />
              Effacer tout
            </button>
          )}
        </div>
        
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 w-full p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          placeholder="Collez ici le texte généré par ChatGPT, Gemini ou Claude..."
        />
      </div>
    </div>
  );
}