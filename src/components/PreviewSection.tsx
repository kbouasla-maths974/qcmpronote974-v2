import { CheckCircle2, XCircle, AlertCircle, Sparkles } from 'lucide-react';
import type { Question } from '../core/parser';

interface PreviewSectionProps {
  questions: Question[];
  stats: { questionCount: number; answerCount: number };
}

export function PreviewSection({ questions, stats }: PreviewSectionProps) {
  
  // État vide (si rien n'est collé)
  if (questions.length === 0) {
    return (
      <div className="h-full bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
        <div className="bg-white p-4 rounded-full mb-4 shadow-sm">
          <Sparkles className="w-8 h-8 text-blue-400" />
        </div>
        <p className="font-medium text-slate-600">En attente de contenu...</p>
        <p className="text-sm mt-2 max-w-xs">
          Collez le texte généré par l'IA dans la colonne de gauche pour voir apparaître vos questions ici.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* En-tête avec stats */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800">Aperçu du QCM</h2>
        <div className="flex gap-3">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
            {stats.questionCount} Questions
          </span>
          <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">
            {stats.answerCount} Réponses
          </span>
        </div>
      </div>

      {/* Liste des cartes questions */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {questions.map((q, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            
            {/* Énoncé de la question */}
            <div className="flex gap-3 mb-4">
              <span className="flex-shrink-0 w-6 h-6 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center text-xs font-bold">
                {idx + 1}
              </span>
              <div 
                className="text-slate-800 font-medium pt-0.5"
                dangerouslySetInnerHTML={{ __html: q.question }} 
              />
            </div>

            {/* Liste des réponses */}
            <div className="space-y-2 pl-9">
              {q.reponses.map((rep, rIdx) => (
                <div 
                  key={rIdx} 
                  className={`
                    p-3 rounded-lg border text-sm flex items-start gap-3
                    ${rep.correct ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}
                  `}
                >
                  {rep.correct ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  )}
                  
                  <div className="flex-1">
                    <div 
                      className={rep.correct ? 'text-green-900' : 'text-red-900'}
                      dangerouslySetInnerHTML={{ __html: rep.texte }}
                    />
                    {/* Feedback (Explication) */}
                    {rep.feedback && (
                      <div className="mt-2 flex gap-2 text-xs text-slate-500 bg-white/50 p-2 rounded">
                        <AlertCircle className="w-3 h-3 mt-0.5" />
                        <span>{rep.feedback}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}