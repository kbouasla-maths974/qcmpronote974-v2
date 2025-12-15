// Dictionnaire des symboles LaTeX vers HTML
const LATEX_REPLACEMENTS: Record<string, string> = {
  ";": "&emsp;",
  ",": "&thinsp;",
  ":": "&ensp;",
  quad: "&emsp;",
  qquad: "&emsp;&emsp;",
  space: "&nbsp;",
  hspace: "&ensp;",
  vspace: "&ensp;",
  alpha: "&alpha;",
  beta: "&beta;",
  gamma: "&gamma;",
  delta: "&delta;",
  epsilon: "&epsilon;",
  zeta: "&zeta;",
  eta: "&eta;",
  theta: "&theta;",
  iota: "&iota;",
  kappa: "&kappa;",
  lambda: "&lambda;",
  mu: "&mu;",
  nu: "&nu;",
  xi: "&xi;",
  pi: "&pi;",
  rho: "&rho;",
  sigma: "&sigma;",
  tau: "&tau;",
  upsilon: "&upsilon;",
  phi: "&phi;",
  chi: "&chi;",
  psi: "&psi;",
  omega: "&omega;",
  Gamma: "&Gamma;",
  Delta: "&Delta;",
  Theta: "&Theta;",
  Lambda: "&Lambda;",
  Xi: "&Xi;",
  Pi: "&Pi;",
  Sigma: "&Sigma;",
  Upsilon: "&Upsilon;",
  Phi: "&Phi;",
  Psi: "&Psi;",
  Omega: "&Omega;",
  varphi: "&#981;",
  vartheta: "&#977;",
  varsigma: "&#962;",
  varpi: "&#982;",
  varrho: "&#1009;",
  varepsilon: "&#1013;",
  times: "&times;",
  infty: "&infin;",
  forall: "&forall;",
  exists: "&exist;",
  partial: "&part;",
  emptyset: "&empty;",
  perp: "&perp;",
  int: "&int;",
  nabla: "&nabla;",
  sqrt: "&radic;",
  sum: "&sum;",
  prod: "&prod;",
  approx: "&asymp;",
  sim: "&sim;",
  equiv: "&equiv;",
  geq: "&ge;",
  leq: "&le;",
  subset: "&sub;",
  supset: "&sup;",
  subseteq: "&sube;",
  supseteq: "&supe;",
  notin: "&notin;",
  cup: "&cup;",
  cap: "&cap;",
  union: "&cup;",
  intersect: "&cap;",
  setminus: "&#8726;",
  cdot: "&middot;",
  neq: "&ne;",
  div: "&divide;",
  circ: "&#8728;",
  to: "&rarr;",
  implies: "&#8658;",
  iff: "&#8660;",
  dagger: "&dagger;",
  ddagger: "&#8225;",
  hat: "^",
  bar: "&#773;",
  overline: "&#773;",
  tilde: "&#8764;",
  dot: "&#729;",
  ddot: "&#776;",
  vec: "&#8594;",
  left: "",
  right: "",
  lbrace: "{",
  rbrace: "}",
  lparen: "(",
  rparen: ")",
  lbrack: "[",
  rbrack: "]",
  langle: "&#9001;",
  rangle: "&#9002;",
  ldots: "&#8230;",
  cdots: "&#8943;",
  vdots: "&#8942;",
  ddots: "&#8945;",
  prime: "&prime;",
  dprime: "&Prime;"
};

interface LatexStructure {
  type: string;
  contenu: any;
}

// Fonction principale : Convertit une chaîne LaTeX en HTML
export function formatLatexToHtml(text: string): string {
  // Correction ici : on remplace 'match' par '_' pour dire qu'on l'ignore
  const replacer = (_: string, content: string, isBlock = false) => {
    // Correction ici : on ignore le premier élément du tableau (structures) avec la virgule
    const [, formattedText] = rechercheCaracteresSpeciauxLatex(content);
    return `<span style="${
      isBlock
        ? "display:block;margin:1em 0;font-family:times;font-size:1.4em;"
        : "font-family:times;padding:0 .1em;font-size:1.2em;font-style:normal;"
    }">${formattedText}</span>`;
  };

  let processed = text;
  // Remplacer $$...$$ (bloc)
  processed = processed.replace(/\$\$(.+?)\$\$/gs, (_, content) => replacer(_, content, true));
  // Remplacer \(...\) (inline)
  processed = processed.replace(/\\\((.+?)\\\)/g, (_, content) => replacer(_, content));
  // Remplacer $...$ (inline)
  processed = processed.replace(/\$(.+?)\$/g, (_, content) => replacer(_, content));

  return processed;
}

function rechercheCaracteresSpeciauxLatex(input: string): [LatexStructure[], string] {
  const structures: LatexStructure[] = [];
  let formattedText = "";
  let cursor = 0;

  while (cursor < input.length) {
    const char = input[cursor];

    if (char === "_") {
      const res = gestionIndiceOuExposant("indice", input, cursor, structures, formattedText);
      cursor = res.cursor;
      formattedText = res.texteFormatte;
    } else if (char === "^") {
      const res = gestionIndiceOuExposant("exposant", input, cursor, structures, formattedText);
      cursor = res.cursor;
      formattedText = res.texteFormatte;
    } else if (char === "\\") {
      const res = gestionContenuApresBackslash(input, cursor, structures, formattedText);
      cursor = res.cursor;
      formattedText = res.texteFormatte;
    } else {
      const res = gestionTexteSimple(input, cursor, structures, formattedText);
      cursor = res.cursor;
      formattedText = res.texteFormatte;
    }
  }

  return [structures, formattedText];
}

function gestionIndiceOuExposant(
  type: "indice" | "exposant",
  input: string,
  cursor: number,
  structures: LatexStructure[],
  currentText: string
) {
  let endCursor: number;
  let contentData: [LatexStructure[], string];

  if (input[cursor + 1] === "{") {
    endCursor = trouverFinAccolade(input, cursor + 2);
    contentData = rechercheCaracteresSpeciauxLatex(input.substring(cursor + 2, endCursor));
    endCursor += 1; // Sauter l'accolade fermante
  } else if (/[a-zA-Z0-9]/.test(input[cursor + 1])) {
    endCursor = cursor + 2;
    contentData = rechercheCaracteresSpeciauxLatex(input[cursor + 1]);
  } else if (input[cursor + 1] === "\\") {
    endCursor = trouverFinCommandeLatex(input, cursor + 1);
    contentData = rechercheCaracteresSpeciauxLatex(input.substring(cursor + 1, endCursor));
  } else {
    // Cas d'erreur ou format inattendu, on traite comme texte simple pour éviter le crash
    return gestionTexteSimple(input, cursor, structures, currentText);
  }

  structures.push({ type, contenu: contentData[0] });
  const tag = type === "indice" ? "sub" : "sup";
  const newText = currentText + `<${tag}>${contentData[1]}</${tag}>`;

  return { cursor: endCursor, texteFormatte: newText };
}

function gestionContenuApresBackslash(
  input: string,
  cursor: number,
  structures: LatexStructure[],
  currentText: string
) {
  const accoladeOuvranteIndex = input.indexOf("{", cursor);
  const finCommandeIndex = trouverFinCommandeLatex(input, cursor);

  // Cas: \commande sans accolade ou avec accolade loin
  const commande =
    accoladeOuvranteIndex > -1 &&
    (accoladeOuvranteIndex < finCommandeIndex || finCommandeIndex === -1)
      ? input.substring(cursor + 1, accoladeOuvranteIndex)
      : input.substring(cursor + 1, finCommandeIndex > -1 ? finCommandeIndex : input.length);

  // Si pas d'accolade ouvrante collée à la commande
  if (accoladeOuvranteIndex === -1 || accoladeOuvranteIndex > cursor + commande.length + 1) {
    structures.push({ type: commande, contenu: null });
    const newText = currentText + formatterCommandeSansAccolade(commande);
    return { cursor: cursor + commande.length + 1, texteFormatte: newText };
  }

  // Gestion des accolades
  const finPremiereAccolade = trouverFinAccolade(input, accoladeOuvranteIndex + 1);

  // Vérifier s'il y a une deuxième paire d'accolades (ex: \frac{a}{b})
  if (/^\s*{/.test(input.substring(finPremiereAccolade + 1))) {
    const debutDeuxieme = finPremiereAccolade + 1; // Juste après la première }
    const finDeuxieme = trouverFinAccolade(input, debutDeuxieme + 1);

    const arg1 = rechercheCaracteresSpeciauxLatex(
      input.substring(accoladeOuvranteIndex + 1, finPremiereAccolade)
    );
    const arg2 = rechercheCaracteresSpeciauxLatex(input.substring(debutDeuxieme + 1, finDeuxieme));

    structures.push({ type: commande, contenu: [arg1[0], arg2[0]] });
    const newText = currentText + formatterCommandeAvecDeuxAccolades(commande, arg1[1], arg2[1]);
    return { cursor: finDeuxieme + 1, texteFormatte: newText };
  }

  // Commande avec une seule accolade (ex: \sqrt{x})
  const arg = rechercheCaracteresSpeciauxLatex(
    input.substring(accoladeOuvranteIndex + 1, finPremiereAccolade)
  );
  structures.push({ type: commande, contenu: arg[0] });
  const newText = currentText + formatterCommandeAvecUneAccolade(commande, arg[1]);
  return { cursor: finPremiereAccolade + 1, texteFormatte: newText };
}

function trouverFinCommandeLatex(input: string, cursor: number): number {
  if (input[cursor] !== "\\") return input.length;
  const sub = input.slice(cursor + 1);
  const match = sub.slice(1).match(/[^a-zA-Z]/);
  if (match && match.index !== undefined) {
    return cursor + 2 + match.index;
  }
  return input.length;
}

function formatterCommandeSansAccolade(commande: string): string {
  let result = commande;
  for (const [key, value] of Object.entries(LATEX_REPLACEMENTS)) {
    // Si la clé est "alpha", on cherche \alpha entier, sinon remplacement simple
    const escapedKey = key.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    const regex = /[\w]/.test(key) ? new RegExp(`\\b${escapedKey}\\b`, "g") : new RegExp(escapedKey, "g");
    result = result.replace(regex, value);
  }
  return result;
}

function formatterCommandeAvecUneAccolade(commande: string, arg: string): string {
  if (commande === "vec" || commande === "overrightarrow") {
    return `
      <span style="all: unset !important; position: relative !important; display: inline-block !important; margin-top: .4em !important; width: fit-content !important;">
        <span style="content: ''; display: inline-block; position: absolute !important; border: .5px solid !important; box-sizing: border-box !important; width: 100% !important; height: 0 !important; background-color: black !important; right: 0 !important; top: -0.08em !important;"></span>
        <span style="content: ''; display: inline-block; position: absolute !important; border: 1px solid !important; border-left: 0 !important; border-bottom: 0 !important; width: .25em !important; height: .25em !important; right: .05em !important; top: -0.08em !important; box-sizing: content-box !important; transform-origin: right center !important; transform: rotate(45deg) !important;"></span>
        ${arg}
      </span>`;
  }
  if (commande === "sqrt") {
    return `
      <span style="all: unset !important; position: relative !important; display: inline-block !important; margin-left: .7em !important; padding-left: .2em !important; padding-right: .1em !important; border-top: 2px solid black !important;">
        <span style="content: ''; position: absolute !important; display: inline-block !important; left: -.65em !important; height: 56% !important; width: .6em !important; border-right: 2px solid black !important; border-bottom: 2.5px solid black !important; transform-origin: top right !important; transform: rotate(55deg) skew(50deg) !important;"></span>
        ${arg}
      </span>`;
  }
  if (commande === "mathbb") {
    switch (arg) {
      case "R": return "&#8477;";
      case "Z": return "&#8484;";
      case "N": return "&#8469;";
      case "Q": return "&#8474;";
      default: return `\\${commande}{${arg}}`;
    }
  }
  if (commande === "text" || commande === "mathrm") {
    return arg.replace(/\\text\s*{([^}]*)}/g, "$1");
  }
  return `\\${commande}{${arg}}`;
}

function formatterCommandeAvecDeuxAccolades(commande: string, arg1: string, arg2: string): string {
  if (commande === "frac") {
    return `
      <span style="display: inline-block; margin-left: .1em; margin-right: .1em; vertical-align: -64%; text-align: center;">
        <span style="display: inline-block; padding: 0 .1em;">${arg1}</span>
        <span style="display: block; height: 0; margin: 0; border: 0; border-bottom: .1em solid; overflow: hidden;">/</span>
        <span style="display: inline-block; padding: 0 .1em; vertical-align: top;">${arg2}</span>
      </span>`;
  }
  return `\\${commande}{${arg1}}{${arg2}}`;
}

function gestionTexteSimple(
  input: string,
  cursor: number,
  structures: LatexStructure[],
  currentText: string
) {
  const nextSpecialChar = input.substring(cursor).search(/[_^\\]/);
  const endCursor = nextSpecialChar !== -1 ? nextSpecialChar + cursor : input.length;
  const content = input.substring(cursor, endCursor);

  structures.push({ type: "texte", contenu: content });
  const newText = currentText + content;

  return { cursor: endCursor, texteFormatte: newText };
}

function trouverFinAccolade(input: string, cursor: number): number {
  let stack = 1;
  for (let i = cursor; i < input.length; i++) {
    if (input[i] === "{") stack++;
    else if (input[i] === "}") stack--;

    if (stack === 0) return i;
  }
  return input.length;
}