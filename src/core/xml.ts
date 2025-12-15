import type { Question } from "./parser";

interface QuizMetadata {
  name: string;
  niveau: string;
  matiere: string;
}

export function generatePronoteXML(questions: Question[], metadata: QuizMetadata): string {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
  <quiz>
<question type="category">
  <category>
    <text><![CDATA[<infos>
<name>${metadata.name}</name>
<answernumbering>123</answernumbering>
<niveau>${metadata.niveau}</niveau>
<matiere>${metadata.matiere}</matiere>
</infos>]]></text>
  </category>
</question>
`;

  questions.forEach((q, index) => {
    // Calcul de la note (fraction)
    // Si c'est une question à choix unique (radio), la bonne réponse vaut 100%
    // Si choix multiple, on divise 100 par le nombre de bonnes réponses
    const bonnesReponses = q.reponses.filter((r) => r.correct);
    const pointsParBonneReponse = bonnesReponses.length > 0 ? Math.round(100 / bonnesReponses.length) : 0;
    const isSingle = bonnesReponses.length === 1;

    xml += `
<question type="multichoice">
  <name>
    <text><![CDATA[Question ${index + 1}]]></text>
  </name>
  <questiontext format="html">
    <text><![CDATA[<div style="font-family: Arial; font-size: 13px;">${q.question}</div>]]></text>
  </questiontext>
  <externallink/>
  <usecase>1</usecase>
  <defaultgrade>1</defaultgrade>
  <editeur>0</editeur>
  <single>${isSingle ? "true" : "false"}</single>
`;

    // Mélanger les réponses pour qu'elles n'apparaissent pas toujours dans l'ordre a,b,c
    const reponsesMelangees = [...q.reponses].sort(() => Math.random() - 0.5);

    reponsesMelangees.forEach((rep) => {
      const fraction = rep.correct ? pointsParBonneReponse : 0;
      
      xml += `
  <answer fraction="${fraction}" format="html">
    <text><![CDATA[<div style="font-family: Arial; font-size: 13px;">${rep.texte}</div>]]></text>
    <feedback>
      <text><![CDATA[${rep.feedback || ""}]]></text>
    </feedback>
  </answer>`;
    });

    xml += `
</question>
`;
  });

  xml += `</quiz>`;
  return xml;
}