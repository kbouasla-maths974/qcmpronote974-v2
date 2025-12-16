export interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback?: string; // Ajout du feedback spécifique par réponse
}

export interface Question {
  id: number;
  text: string;
  answers: Answer[];
  globalFeedback?: string; // Feedback général (si besoin)
}

/**
 * PARSER V3 : Supporte les feedbacks spécifiques par ligne.
 * Format : [-] Mauvaise réponse [F] Pourquoi c'est faux
 */
export const parseQuestions = (input: string): Question[] => {
  // 1. Nettoyage
  const cleanInput = input
    .replace(/```(?:text|xml)?/g, '')
    .replace(/```/g, '')
    .replace(/\r\n/g, '\n');

  // 2. Découpage par question
  const blocks = cleanInput.split('[Q]');
  const questions: Question[] = [];

  blocks.forEach((block, index) => {
    if (!block.trim()) return;

    // A. Extraction de l'énoncé
    const questionMatch = block.match(/^(.*?)(?=\[(?:\+|-)\])/s);
    let questionText = questionMatch ? questionMatch[1].trim() : "Question sans énoncé";

    // B. Extraction des réponses ligne par ligne (plus robuste pour les feedbacks)
    // On cherche tout ce qui commence par [+] ou [-]
    const answerRegex = /\[(\+|-)\]\s*(.*?)(?=\n\[(?:\+|-)\]|$|\n\s*$)/gs;
    
    // Si la regex ci-dessus est trop stricte, on peut itérer sur les lignes :
    const lines = block.split('\n');
    const answers: Answer[] = [];
    let answerIndex = 0;
    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];

    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('[+]') || trimmed.startsWith('[-]')) {
        const isCorrect = trimmed.startsWith('[+]');
        
        // On retire le marqueur [+] ou [-]
        let content = trimmed.substring(3).trim();
        let feedback = undefined;

        // On cherche le tag [F] dans la ligne
        if (content.includes('[F]')) {
          const parts = content.split('[F]');
          content = parts[0].trim();
          feedback = parts[1] ? parts[1].trim() : undefined;
        }

        answers.push({
          id: letters[answerIndex] || `opt${answerIndex}`,
          text: content,
          isCorrect: isCorrect,
          feedback: feedback
        });
        answerIndex++;
      }
    });

    // C. Validation
    if (answers.length > 0) {
      questions.push({
        id: index + 1,
        text: questionText,
        answers: answers
      });
    }
  });

  return questions;
};