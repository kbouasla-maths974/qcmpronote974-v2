import { formatLatexToHtml } from "./latex";

export interface Reponse {
  texte: string;
  correct: boolean;
  feedback?: string;
}

export interface Question {
  question: string;
  reponses: Reponse[];
}

export function parseQCM(text: string): Question[] {
  // Sécuriser l'entrée
  const safeText = "\n" + (text || "");
  const lines = safeText.split("\n");
  
  const questions: Question[] = [];
  let currentQuestionText: string | null = null;
  let currentReponses: Reponse[] = [];
  
  // Regex (Expressions régulières) pour détecter les motifs
  const regexQuestion = /^\s*#*\s*question[\s]*[a-zA-Z0-9]*[\s]*?[.:),;}\]]\s*/i;
  const regexReponse = /^\s*réponse\s+[a-zA-Z0-9]+[\s]*[.:),;}\]]/i;

  let i = 0;
  while (i < lines.length) {
    const line = retirerEtoilesEtDieses(lines[i]).trim();

    // Cas 1 : C'est une QUESTION
    if (regexQuestion.test(line)) {
      // Si on avait déjà une question en cours, on l'enregistre
      if (currentQuestionText) {
        questions.push({
          question: currentQuestionText,
          reponses: currentReponses
        });
        currentReponses = [];
      }

      // On nettoie le texte de la nouvelle question (enlève "Question 1 :")
      // et on transforme les maths en HTML
      currentQuestionText = formatQuestionReponse(line, regexQuestion);
      i++;
    } 
    // Cas 2 : C'est une RÉPONSE
    else if (regexReponse.test(line)) {
      let reponseTexte = formatQuestionReponse(line, regexReponse);
      let isCorrect = false;
      let feedback: string | undefined = undefined;

      // On regarde les lignes suivantes pour trouver les balises %%CORRECT%% etc.
      i++;
      while (i < lines.length) {
        const nextLine = lines[i].trim();
        
        if (nextLine.startsWith("%%CORRECT%%")) {
          isCorrect = true;
        } else if (nextLine.startsWith("%%INCORRECT%%")) {
          isCorrect = false;
        } else if (nextLine.startsWith("%%FEEDBACK%%")) {
          feedback = nextLine.replace("%%FEEDBACK%%", "").trim();
        } else if (regexReponse.test(nextLine) || regexQuestion.test(nextLine)) {
          // On est tombé sur la suite, on arrête de chercher des balises pour cette réponse
          break;
        }
        i++;
      }

      currentReponses.push({
        texte: reponseTexte,
        correct: isCorrect,
        feedback: feedback
      });
    } 
    // Cas 3 : C'est une suite de texte (multiligne)
    else {
      if (currentQuestionText !== null && line.length > 0) {
        // C'est probablement la suite de la question précédente
        currentQuestionText += " " + formatQuestionReponse(line, / /); // Regex vide juste pour nettoyer
      }
      i++;
    }
  }

  // N'oublie pas d'enregistrer la toute dernière question
  if (currentQuestionText) {
    questions.push({
      question: currentQuestionText,
      reponses: currentReponses
    });
  }

  return questions;
}

// Nettoie les **gras** et ## titres du Markdown
function retirerEtoilesEtDieses(text: string): string {
  return text.replace(/(\*\*+|##+)/g, "");
}

// Nettoie le préfixe (ex: "Réponse a)") et formate le LaTeX
function formatQuestionReponse(text: string, regexPrefix: RegExp): string {
  const textWithoutPrefix = text.replace(regexPrefix, "").trim();
  return formatLatexToHtml(textWithoutPrefix);
}