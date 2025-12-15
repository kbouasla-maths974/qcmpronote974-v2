import { useState, useEffect, useCallback } from 'react';
import { parseQCM, type Question } from '../core/parser';
import { generatePronoteXML } from '../core/xml';

export function useConverter() {
  // --- 1. L'état (La mémoire de l'app) ---
  
  // Les infos du QCM (Titre, matière...)
  const [metadata, setMetadata] = useState({
    name: '',
    niveau: '',
    matiere: ''
  });

  // Le texte brut collé par l'utilisateur
  const [inputText, setInputText] = useState('');

  // Le résultat : la liste des questions comprises par le système
  const [questions, setQuestions] = useState<Question[]>([]);

  // --- 2. La Magie (Effets automatiques) ---

  // Dès que 'inputText' change, on relance le parseur automatiquement
  useEffect(() => {
    if (!inputText.trim()) {
      setQuestions([]);
      return;
    }
    // On appelle notre cerveau (parser.ts)
    const parsed = parseQCM(inputText);
    setQuestions(parsed);
  }, [inputText]);

  // --- 3. Les Actions ---

  // Fonction pour télécharger le fichier final
  const downloadXML = useCallback(() => {
    if (questions.length === 0) return;

    // On appelle notre générateur (xml.ts)
    const xmlContent = generatePronoteXML(questions, metadata);
    
    // Création du fichier virtuel
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    
    // Déclenchement du téléchargement
    const a = document.createElement('a');
    a.href = url;
    // Nom du fichier propre (ex: Maths_QCM1.xml)
    const safeName = (metadata.name || 'QCM').replace(/[^a-z0-9]/gi, '_');
    a.download = `${safeName}.xml`;
    document.body.appendChild(a);
    a.click();
    
    // Nettoyage
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [questions, metadata]);

  // Calcul des stats pour l'affichage (ex: "12 questions détectées")
  const stats = {
    questionCount: questions.length,
    answerCount: questions.reduce((acc, q) => acc + q.reponses.length, 0)
  };

  // On renvoie tout ça aux composants graphiques
  return {
    metadata,
    setMetadata,
    inputText,
    setInputText,
    questions,
    stats,
    downloadXML
  };
}