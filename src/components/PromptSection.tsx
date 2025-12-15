import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { PROMPT_INSTRUCTIONS } from '../core/constants';

export function PromptSection() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(PROMPT_INSTRUCTIONS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erreur copie', err);
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
            🤖 Étape 1 : Préparez votre IA
          </h2>
          <p className="text-blue-700 mt-1">
            Pour que ce convertisseur fonctionne, votre IA (ChatGPT, Gemini...) doit respecter un format précis.
          </p>
        </div>
        
        <button
          onClick={handleCopy}
          className={`
            flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all shadow-sm
            ${copied 
              ? 'bg-green-600 text-white hover:bg-green-700' 
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-0.5'
            }
          `}
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Instructions copiées !' : 'Copier le Prompt'}
        </button>
      </div>
    </div>
  );
}