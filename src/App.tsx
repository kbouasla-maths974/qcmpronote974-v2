import { Download } from 'lucide-react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { PromptSection } from './components/PromptSection';
import { EditorSection } from './components/EditorSection';
import { PreviewSection } from './components/PreviewSection';
import { useConverter } from './hooks/useConverter';

function App() {
  // On récupère toute la logique depuis notre Hook
  const {
    metadata,
    setMetadata,
    inputText,
    setInputText,
    questions,
    stats,
    downloadXML
  } = useConverter();

  const hasQuestions = questions.length > 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Zone 1 : Le Prompt */}
        <PromptSection />

        {/* Zone 2 : L'Atelier (Grid 2 colonnes) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Colonne Gauche : Éditeur */}
          <div className="lg:sticky lg:top-8 h-auto">
            <EditorSection 
              metadata={metadata}
              setMetadata={setMetadata}
              inputText={inputText}
              setInputText={setInputText}
            />
          </div>

          {/* Colonne Droite : Aperçu */}
          <div className="h-full">
            <PreviewSection 
              questions={questions}
              stats={stats}
            />
          </div>

        </div>
      </main>

      {/* Zone 3 : Barre d'action fixe en bas si des questions sont prêtes */}
      {hasQuestions && (
        <div className="sticky bottom-0 bg-white border-t border-slate-200 p-4 shadow-lg animate-in slide-in-from-bottom duration-300 z-50">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-600 hidden sm:block">
              <strong className="text-slate-900">{stats.questionCount} questions</strong> prêtes à l'export.
            </div>
            
            <button
              onClick={downloadXML}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-green-600/20 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Télécharger QCM.xml
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default App;