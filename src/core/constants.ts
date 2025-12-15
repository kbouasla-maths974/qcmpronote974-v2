export const PROMPT_INSTRUCTIONS = `# 🧠 Consignes pour la génération de QCM – **Format strict, structuré et pédagogique**

Ces instructions doivent être **scrupuleusement suivies** pour générer des QCM adaptés à un usage pédagogique, en respectant un format lisible, normé et compatible avec un traitement automatisé.

---

## 🎯 1. Thème

Commencer chaque QCM par :

**Thème du QCM :** ........................................  
(remplacer les points par le thème précisé par l’utilisateur)

---

## ✍️ 2. Rédaction des questions

### a) Présentation

- Chaque question commence par :  
  \`Question X :\` suivi de l’intitulé de la question en **HTML autorisé** et **LaTeX intégré entre** \\\\( ... \\\\).

  Exemple :  
  \`Question 1 : Quelle est la valeur de \\\\(\\pi\\\\) ?\`

### b) Nombre de réponses

- Si l’utilisateur ne précise rien : **4 propositions** par question (Réponse a, b, c, d).

---

## 🧪 3. Règles de rédaction scientifiques

### a) Mathématiques et formules

- Utiliser uniquement du **LaTeX encadré par** \\\\( ... \\\\) pour :
  - lettres grecques : \`\\\\alpha\`, \`\\\\beta\`, etc.
  - indices : \`H_2O\`, exposants : \`x^2\`, vecteurs : \`\\\\vec{v}\`
  - fractions : \`\\\\frac{a}{b}\`, racines : \`\\\\sqrt{x}\`

Important : les formules LaTeX ne doivent apparaître que dans les questions ou les intitulés de réponse.  
Elles sont strictement interdites dans les feedbacks, même entre parenthèses.

### b) Notation des nombres

- Respecter la **notation française** :
  - Virgule pour les décimales (ex. : \`3,14\`)
  - Aucun espace ni point pour les milliers (ex. : \`1000\` et non \`1 000\`)

### c) Unités de mesure

- Éviter les slash \`/\`. Les réécrire en puissances négatives :
  - \`m/s\` devient \`m.s^{-1}\`
  - \`km/h\` devient \`km.h^{-1}\`

---

## 🧱 4. Format des propositions de réponse

Chaque proposition suit **ce format structuré, lisible par un programme** :

1. Une ligne contenant : \`Réponse a)\`, \`Réponse b)\`, etc., suivie de l’intitulé (en HTML + LaTeX autorisé)  
2. Une **ligne vide** 3. Une ligne avec soit \`%%CORRECT%%\`, soit \`%%INCORRECT%%\`  
4. Une ligne optionnelle de commentaire, commençant par \`%%FEEDBACK%%\`

### ⚠️ Contraintes strictes pour le feedback

Le **texte du feedback** est obligatoirement :
- En **texte brut uniquement**
- Sans balises HTML (\`<...>\`)
- Sans LaTeX (\`\\\\( \\\\)\`, \`\\\\frac\`, etc.)
- Sans styles (\`**gras**\`, \`//italique//\`, etc.)
- Sans entités HTML (\`&deg;\`, \`&eacute;\`, etc.)

> ✅ Bon exemple :  
> \`%%FEEDBACK%% Cette valeur est un arrondi courant de pi.\`

> ❌ Mauvais exemples :  
> \`%%FEEDBACK%% La valeur est \\\\( \\\\frac{22}{7} \\\\)\`  
> \`%%FEEDBACK%% <strong>Mauvaise réponse</strong>\`

### ⚠️ Interdiction renforcée

Le contenu du \`%%FEEDBACK%%\` ne doit contenir **aucun symbole mathématique, ni aucune tentative de formules**, y compris entre parenthèses.  
Les exemples suivants sont **interdits**, même s’ils ne sont pas encadrés de \`\\\\( ... \\\\)\` :

- \`(H_2O)\`
- \`\\\\alpha\`
- \`x^2\`
- \`m/s\`
- \`sqrt(x)\`

> Seul le **texte brut explicatif** est autorisé.

---

## 🧭 5. Détection du type de QCM

- Une seule ligne \`%%CORRECT%%\` → **question à réponse unique** - Plusieurs lignes \`%%CORRECT%%\` → **question à choix multiples**

---

## 🧪 6. Exemples de questions

### ✅ Exemple 1 – Réponse unique

Question 1 : Quelle est la valeur de \\\\(\\pi\\\\) ?  
Réponse a) 3,14

%%CORRECT%%

Réponse b) 3

%%INCORRECT%%  
%%FEEDBACK%% Trop petit, arrondi incorrect.

Réponse c) 4

%%INCORRECT%%  
%%FEEDBACK%% Ce n’est pas la valeur de pi, mais un entier.

Réponse d) 2,71

%%INCORRECT%%  
%%FEEDBACK%% C’est la valeur de e, pas de pi.

### ✅ Exemple 2 – Choix multiples

Question 2 : Quelles affirmations sont vraies à propos de l’eau ?  
Réponse a) L’eau bout à 100 °C à pression atmosphérique

%%CORRECT%%

Réponse b) L’eau est un gaz à 20 °C

%%INCORRECT%%  
%%FEEDBACK%% À cette température, l’eau est liquide.

Réponse c) La formule chimique de l’eau est \\\\(H_2O\\\\)

%%CORRECT%%

Réponse d) L’eau est un métal

%%INCORRECT%%  
%%FEEDBACK%% C’est un liquide moléculaire.

---

Merci de **respecter l’intégralité de ces consignes** afin de garantir une production cohérente, lisible, pédagogique et exploitable automatiquement.`;

export const EXAMPLE_QUESTIONS = `**Thème du QCM :** Seconde loi de Newton

---

**Question 1 : Quelles affirmations sont vraies concernant la seconde loi de Newton ?**

Réponse a) Elle relie la somme des forces appliquées à un corps à l’accélération de celui-ci
%%CORRECT%%

Réponse b) Elle s’écrit $\\vec{F} = m \\times \\vec{a}$
%%CORRECT%%

Réponse c) Elle s’applique uniquement aux objets immobiles
%%INCORRECT%%
%%FEEDBACK%% Elle s’applique aussi bien aux objets en mouvement qu’aux objets immobiles.

Réponse d) L’accélération est toujours constante selon cette loi
%%INCORRECT%%
%%FEEDBACK%% L’accélération peut varier si les forces appliquées varient.

Réponse e) Elle peut aussi s’écrire $\\vec{F} = m \\, \\frac{d\\vec{v}}{dt}$
%%CORRECT%%`;