# 🔮 IA vers Pronote : Le Convertisseur de QCM

> **"Ne perdez plus votre vie à créer des QCM case par case."**

Bienvenue sur le dépôt de l'application qui réconcilie enfin l'Intelligence Artificielle et Pronote (et Moodle \!).

-----

## 🚀 Démo en direct

Pas envie de lire le code ? Vous voulez juste générer un QCM maintenant ?  
👉 **[Cliquez ici pour accéder à l'application](https://www.google.com/search?q=https://kbouasla-maths974.github.io/qcmpronote974-v2/)**

-----

## 🤔 C'est quoi ce truc ?

En tant qu'enseignant, vous utilisez peut-être ChatGPT, Gemini ou Claude pour générer des idées de questions. C'est super \! Mais après... il faut tout copier-coller manuellement dans Pronote. C'est long. C'est pénible.

**Ce convertisseur fait le "sale boulot" pour vous :**

1.  Il prend le texte brut de votre IA.
2.  Il le comprend (même les formules de maths complexes \! 📐).
3.  Il le transforme en un fichier `.xml` que Pronote et Moodle adorent.

-----

## 🛠️ Comment ça marche ? (En 3 clics)

L'application est conçue pour être **zéro friction**.

1.  **🤖 Le Prompt :** Sur l'appli, copiez le "Prompt Magique" et donnez-le à votre IA préférée. Cela lui apprend à parler notre langue.
2.  **📝 Le Collage :** Copiez la réponse de l'IA et collez-la dans notre éditeur.
3.  **✨ La Magie :** L'aperçu se met à jour instantanément. Vérifiez que tout est beau (surtout les maths \!), puis cliquez sur **"Télécharger QCM.xml"**.

Il ne vous reste plus qu'à importer ce fichier dans Pronote (*Ressources \> QCM \> Importer*).

-----

## ⚡ Fonctionnalités Clés

  * **⚡ Instantané :** Pas de temps de chargement, tout se passe dans votre navigateur.
  * **scie\_à\_métaux :** Analyseur robuste (Regex) pour découper questions, réponses et feedbacks.
  * **📐 Maths Friendly :** Gestion native du **LaTeX**. Les formules comme `\frac{1}{2}` ou `\sqrt{x}` sont converties en HTML/CSS pour être lisibles dans Pronote sans plugin.
  * **🔒 Vie privée :** Aucune donnée n'est envoyée sur un serveur. Tout le traitement se fait localement sur votre ordinateur.
  * **🎨 UI Moderne :** Interface épurée, pensée pour ne pas donner mal à la tête.

-----

## 👩‍💻 Pour les Développeurs (Sous le capot)

Vous voulez voir comment la saucisse est fabriquée ? Voici la stack technique :

  * **Cœur :** [React 18](https://react.dev/) (avec TypeScript pour la rigueur).
  * **Vitesse :** [Vite](https://vitejs.dev/) (pour un développement éclair).
  * **Style :** [Tailwind CSS](https://tailwindcss.com/) (pour le look "pro" sans effort).
  * **Icônes :** [Lucide React](https://lucide.dev/).
  * **Logique :** Un parser Regex fait maison et un moteur de rendu LaTeX -\> HTML/CSS customisé (situés dans `src/core`).

### Installation locale

Si vous voulez bidouiller le code :

```bash
# 1. Cloner le repo
git clone https://github.com/kbouasla-maths974/qcmpronote974.git

# 2. Entrer dans le dossier
cd qcmpronote974

# 3. Installer les dépendances
npm install

# 4. Lancer le serveur de développement
npm run dev
```

### Déploiement

Le site est hébergé via **GitHub Pages**. Le déploiement est automatisé via le script `npm run deploy` qui utilise le package `gh-pages`.

-----

## 🤝 Contribuer

Une idée ? Un bug repéré ? Une envie d'ajouter l'export pour une autre plateforme ?
Les "Pull Requests" sont les bienvenues \! N'hésitez pas à ouvrir une "Issue" pour discuter.

-----

*Fait avec ❤️ pour maths974.fr (et beaucoup de café) pour simplifier la vie des profs.*