import React, { useState, useEffect } from 'react';
import { Moon, Sun, Download, FileJson, AlertCircle, CheckCircle, XCircle, HelpCircle, FileText } from 'lucide-react';
import PromptBuilder from "./components/PromptBuilder"; 
import { parseQuestions } from './core/parser';

// --- TYPES ---
export interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback?: string;
}

export interface Question {
  id: number;
  text: string;
  answers: Answer[];
  globalFeedback?: string;
  feedback?: string; 
}

// --- MOTEUR DE RENDU VISUEL AMÉLIORÉ (Support Vecteurs & Angles) ---
const LatexRenderer = ({ text }: { text: string }) => {
  if (!text) return null;
  let cleanText = text.replace(/\\\\/g, '\\');
  const parts = cleanText.split(/(\$[^$]+\$)/g);

  return (
    <span>
      {parts.map((part, index) => {
        if (part.startsWith('$') && part.endsWith('$')) {
          let content = part.slice(1, -1);
          
          // 1. Symboles de base
          content = content
            .replace(/\\times/g, '×')
            .replace(/\\div/g, '÷')
            .replace(/\\pi/g, 'π')
            .replace(/\\approx/g, '≈')
            .replace(/\\leq/g, '≤')
            .replace(/\\geq/g, '≥')
            .replace(/\\neq/g, '≠')
            .replace(/\\infty/g, '∞');

          // 2. VECTEURS (\vec{u} ou \overrightarrow{AB})
          // On utilise une astuce CSS (flex column) pour superposer la flèche
          content = content.replace(/\\(vec|overrightarrow)\{([^{}]+)\}/g, 
            '<span class="inline-flex flex-col items-center leading-none align-middle mx-1"><span class="text-[0.6em] mb-[-2px]">→</span><span>$2</span></span>'
          );

          // 3. ANGLES (\widehat{ABC})
          content = content.replace(/\\widehat\{([^{}]+)\}/g, 
            '<span class="inline-flex flex-col items-center leading-none align-middle mx-1"><span class="text-[0.6em] mb-[-4px]">^</span><span>$1</span></span>'
          );

          // 4. FRACTIONS (\frac{a}{b})
          while (content.includes('\\frac{')) {
            content = content.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, 
              '<span class="inline-flex flex-col text-center align-middle mx-1 align-middle"><span class="border-b border-current leading-tight px-1 text-[0.9em]">$1</span><span class="leading-tight text-[0.9em]">$2</span></span>'
            );
          }

          // 5. PUISSANCES & INDICES
          content = content.replace(/\^\{([^{}]+)\}/g, '<sup>$1</sup>');
          content = content.replace(/\^([0-9a-zA-Z]+)/g, '<sup>$1</sup>');
          content = content.replace(/_\{([^{}]+)\}/g, '<sub>$1</sub>');
          content = content.replace(/_([0-9a-zA-Z]+)/g, '<sub>$1</sub>');

          // 6. RACINES
          content = content.replace(/\\sqrt\{([^{}]+)\}/g, '√<span style="border-top:1px solid; padding-top:1px;">$1</span>');

          return <span key={index} className="font-serif italic text-lg text-indigo-700 dark:text-indigo-400 align-middle" dangerouslySetInnerHTML={{ __html: content }} />;
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
};

// --- NETTOYAGE XML POUR PRONOTE (Conversion $...$ en \(...\)) ---
const cleanForXML = (text: string) => {
  if (!text) return "";
  let clean = text.replace(/\\\\/g, '\\');
  // Transforme $formule$ en \(formule\) pour Pronote
  clean = clean.replace(/\$([^$]+)\$/g, '\\($1\\)');
  return clean;
};

function App() {
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const [metaTitle, setMetaTitle] = useState('Evaluation');
  const [metaLevel, setMetaLevel] = useState('3EME');
  const [inputText, setInputText] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if (!inputText.trim()) {
      setQuestions([]);
      return;
    }
    const parsed = parseQuestions(inputText) as unknown as Question[];
    setQuestions(parsed);
  }, [inputText]);

  const handleDownloadXML = () => {
    if (questions.length === 0) return;

    let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n<quiz>\n`;

    xmlContent += `  <question type="category">\n`;
    xmlContent += `    <category>\n`;
    xmlContent += `      <text>$course$/${metaLevel}/${metaTitle}</text>\n`;
    xmlContent += `    </category>\n`;
    xmlContent += `  </question>\n`;

    questions.forEach((q, index) => {
      const correctAnswersCount = q.answers.filter(a => a.isCorrect).length;
      const isSingleChoice = correctAnswersCount === 1; 
      const gradeUnit = correctAnswersCount > 0 ? (100 / correctAnswersCount) : 100;
      const qNumber = (index + 1).toString().padStart(2, '0');
      
      const xmlQuestionText = cleanForXML(q.text);

      xmlContent += `  <question type="multichoice">\n`;
      xmlContent += `    <name><text>${metaLevel} - ${metaTitle} - Q${qNumber}</text></name>\n`;
      xmlContent += `    <questiontext format="html">\n`;
      xmlContent += `      <text><![CDATA[${xmlQuestionText}]]></text>\n`;
      xmlContent += `    </questiontext>\n`;
      xmlContent += `    <single>${isSingleChoice ? 'true' : 'false'}</single>\n`;
      xmlContent += `    <shuffleanswers>true</shuffleanswers>\n`;
      xmlContent += `    <answernumbering>abc</answernumbering>\n`;

      q.answers.forEach((ans) => {
        const fraction = ans.isCorrect ? gradeUnit : 0;
        const xmlAnswerText = cleanForXML(ans.text);
        
        xmlContent += `    <answer fraction="${fraction}" format="html">\n`;
        xmlContent += `      <text><![CDATA[${xmlAnswerText}]]></text>\n`;
        
        if (ans.feedback) {
           const xmlFeedback = cleanForXML(ans.feedback);
           xmlContent += `      <feedback format="html"><text><![CDATA[${xmlFeedback}]]></text></feedback>\n`;
        } else {
           xmlContent += `      <feedback format="html"><text></text></feedback>\n`;
        }
        xmlContent += `    </answer>\n`;
      });
      xmlContent += `  </question>\n`;
    });
    xmlContent += `</quiz>`;

    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pronote-${metaLevel}-${metaTitle.replace(/\s+/g, '_')}.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">Q</span>
            </div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">
              QCM Pronote <span className="text-indigo-600 dark:text-indigo-400">V2</span>
            </h1>
          </div>
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors">
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <section>
          <PromptBuilder />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
               <div className="flex items-center gap-2 mb-3 text-slate-800 dark:text-white font-semibold">
                  <FileText className="w-4 h-4" />
                  <h3>Détails du fichier XML</h3>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Niveau</label>
                    <input type="text" value={metaLevel} onChange={(e) => setMetaLevel(e.target.value)} className="w-full p-2 text-sm border rounded bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Titre du chapitre</label>
                    <input type="text" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className="w-full p-2 text-sm border rounded bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white" />
                  </div>
               </div>
            </div>

            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <span>Collez la réponse de l'IA ici</span>
                <span className="text-xs font-normal text-slate-500 bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full">Format V3</span>
              </h3>
              <button onClick={() => setInputText('')} className="text-xs text-slate-500 hover:text-red-500 transition-colors">Effacer tout</button>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Collez ici le texte..."
              className="w-full h-[500px] p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none outline-none font-mono text-sm shadow-sm"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <span>Aperçu ({questions.length} questions)</span>
              </h3>
            </div>
            
            <div className="h-[620px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-y-auto p-4 shadow-sm relative scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
              {questions.length === 0 ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 text-center p-6">
                   <FileJson className="w-12 h-12 mb-2 opacity-50" />
                   <p>L'aperçu apparaîtra ici.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {questions.map((q, index) => (
                    <div key={q.id} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700">
                      <div className="flex gap-3 mb-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                          {index + 1}
                        </span>
                        <div className="font-medium text-slate-800 dark:text-slate-200 text-lg">
                          <LatexRenderer text={q.text} />
                        </div>
                      </div>

                      <div className="space-y-2 ml-9">
                        {q.answers.map((ans, i) => (
                          <div key={i}>
                            <div className={`flex items-center gap-2 text-sm p-2 rounded ${ans.isCorrect ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300' : 'text-slate-600 dark:text-slate-400'}`}>
                              {ans.isCorrect ? (
                                <CheckCircle className="w-4 h-4 flex-shrink-0 text-green-500" />
                              ) : (
                                <XCircle className="w-4 h-4 flex-shrink-0 text-slate-400" />
                              )}
                              <span className="flex-1">
                                <LatexRenderer text={ans.text} />
                              </span>
                            </div>
                            {ans.feedback && !ans.isCorrect && (
                              <div className="ml-6 mt-1 text-xs text-orange-600 dark:text-orange-400 italic flex gap-1">
                                <HelpCircle className="w-3 h-3 flex-shrink-0" />
                                <span><LatexRenderer text={ans.feedback} /></span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button 
              onClick={handleDownloadXML}
              disabled={questions.length === 0}
              className={`w-full py-3 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all shadow-lg ${
                questions.length > 0 ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20 cursor-pointer' : 'bg-slate-400 cursor-not-allowed opacity-70'
              }`}
            >
              <Download className="w-5 h-5" />
              Télécharger XML Pronote
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;