import React, { useState } from 'react';
import { Copy, Check, Settings2 } from 'lucide-react';

const PromptBuilder = () => {
  const [subject, setSubject] = useState('');
  const [level, setLevel] = useState('Collège (3ème)');
  const [difficulty, setDifficulty] = useState('Moyenne');
  const [questionCount, setQuestionCount] = useState(5);
  const [copied, setCopied] = useState(false);

  const generatePrompt = () => {
    return `Tu es un expert pédagogique. Ton objectif est de créer un QCM de ${questionCount} questions sur le sujet : "${subject || 'A définir'}" (Niveau : ${level}, Difficulté : ${difficulty}).

⚠️ CONSIGNE TECHNIQUE (BLOC DE CODE) :
Fournis le résultat STRICTEMENT dans un bloc de code (markdown) pour éviter que les formules LaTeX ne soient interprétées par le chat.

FORMAT "TAG-SYSTEM" V3 (Feedback par réponse) :

[Q]
L'énoncé de la question. (Pour les maths, utilise LaTeX avec double backslash : \\\\frac{a}{b} ou entoure de $...$).

[+] La bonne réponse
[-] Mauvaise réponse 1 [F] Explication spécifique pour cette erreur
[-] Mauvaise réponse 2 [F] Explication spécifique pour cette erreur
[-] Mauvaise réponse 3 [F] Explication spécifique pour cette erreur

---

RÈGLES IMPORTANTES :
1. Chaque question commence par [Q].
2. [+] pour la bonne réponse.
3. [-] pour une mauvaise réponse.
4. AJOUTE [F] à la fin d'une ligne de réponse pour donner un feedback spécifique à ce choix (C'est très important pour la pédagogie).
5. Pour le LaTeX : Utilise $...$ pour les formules en ligne. Échappe bien les caractères spéciaux si nécessaire.

Exemple de sortie attendue :

\`\`\`text
[Q]
Quel est le résultat de $2 + 2$ ?

[-] 5 [F] Non, tu as peut-être ajouté 1 de trop.
[+] 4
[-] 22 [F] Tu as juxtaposé les chiffres au lieu de les additionner.
[-] 0

[Q]
...
\`\`\``;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatePrompt());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 mb-8 transition-colors">
      <div className="flex items-center gap-2 mb-4">
        <Settings2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Générateur de Prompt (V3 - Expert)</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Sujet du QCM</label>
            <input
              type="text"
              placeholder="Ex: Les nombres relatifs..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-2 border rounded-md bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Niveau</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full p-2 border rounded-md bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
              >
                <option>Collège (6ème)</option>
                <option>Collège (5ème)</option>
                <option>Collège (4ème)</option>
                <option>Collège (3ème)</option>
                <option>Lycée (2nde)</option>
                <option>Lycée (1ère)</option>
                <option>Lycée (Terminale)</option>
                <option>Supérieur</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Difficulté</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full p-2 border rounded-md bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
              >
                <option>Facile</option>
                <option>Moyenne</option>
                <option>Difficile</option>
                <option>Expert</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre de questions : {questionCount}</label>
            <input
              type="range"
              min="1"
              max="20"
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
            />
          </div>
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Prompt à copier pour l'IA :</label>
          <textarea
            readOnly
            value={generatePrompt()}
            className="w-full h-48 p-3 text-xs font-mono bg-slate-900 text-emerald-400 rounded-md border border-slate-700 resize-none focus:outline-none"
          />
          <button
            onClick={handleCopy}
            className={`absolute top-8 right-2 flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-md transition-all ${
              copied 
                ? 'bg-green-500 text-white' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copié !' : 'Copier'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptBuilder;