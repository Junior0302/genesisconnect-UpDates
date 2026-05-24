# GUIDE D'INTEGRATION : ARCHITECTURE HYBRIDE 3D/WEB

Ce guide explique comment structurer le site Genesis Connect pour mélanger contenu web classique et modèle 3D sans bugs.
Il détaille la méthode "Thème par Thème" pour classer les éléments.

---

## 1. PHILOSOPHIE : "SCROLL NATIF"
Nous n'utilisons PAS de scroll virtuel complexe (comme `ScrollControls` de Drei ou Lenis en mode forcé) qui détourne le comportement naturel.
**Nous utilisons le scroll natif du navigateur (`window.scrollY`)**.

**Pourquoi ?**
- Plus stable sur mobile.
- Pas de perte de contenu.
- Le modèle 3D se synchronise simplement en "écoutant" la position de la barre de défilement.

---

## 2. LE SYSTEME DE COUCHES (Z-INDEX)
C'est la règle d'or pour classer les éléments et créer de la profondeur.
Imaginez le site comme un sandwich à 3 étages.

### 🥪 COUCHE 1 : L'ARRIERE-PLAN (Fond)
*Le texte est collé au mur du fond. Le modèle 3D passe devant lui.*

- **Classe CSS** : `z-0`
- **Usage** : Textes philosophiques, arrière-plans décoratifs, citations.
- **Effet** : Le modèle 3D flotte par-dessus ce texte, créant une immersion forte.
- **Code** :
  ```tsx
  <section className="relative z-0 min-h-screen ...">
    {/* Contenu ici */}
  </section>
  ```

### 🥪 COUCHE 2 : LE MODELE 3D (Milieu)
*Le personnage 3D qui flotte entre le fond et l'avant-plan.*

- **Classe CSS** : `z-10`
- **Position** : `fixed` (Il ne bouge pas, c'est le site qui défile sous lui).
- **Propriété Cruciale** : `pointer-events-none` (Pour qu'on puisse cliquer "à travers" lui).
- **Code** :
  ```tsx
  <div className="fixed top-0 left-0 w-full h-screen z-10 pointer-events-none">
    <Scene />
  </div>
  ```

### 🥪 COUCHE 3 : L'AVANT-PLAN (Devant)
*Le texte flotte devant le modèle. Le modèle passe derrière.*

- **Classe CSS** : `z-20`
- **Usage** : Titres principaux (Hero), Boutons, Liens, Menus, Listes interactives.
- **Pourquoi ?** : Si ces éléments étaient derrière le modèle, on ne pourrait pas cliquer dessus quand le modèle passe devant.
- **Code** :
  ```tsx
  <section className="relative z-20 min-h-screen ...">
    {/* Contenu ici */}
  </section>
  ```

---

## 3. COMMENT AJOUTER DU CONTENU (SANS BUG)

### Étape A : Créer la Section
Toujours utiliser une balise `<section>` avec `min-h-screen` (hauteur minimale d'écran) et du padding (`py-24`) pour laisser respirer le design.

### Étape B : Choisir sa Couche
Posez-vous la question : **"Le modèle doit-il passer devant ou derrière ce texte ?"**
- Le modèle doit cacher le texte ? -> Utilisez `z-0`.
- Le texte doit cacher le modèle ? -> Utilisez `z-20`.

### Étape C : L'Animation (GSAP)
Pour que le texte apparaisse élégamment au scroll :
1. Ajoutez la classe `reveal-text` sur le conteneur du texte.
2. C'est tout. Le script dans `page.tsx` détectera automatiquement cette classe et appliquera l'effet d'apparition.

Exemple complet :
```tsx
{/* Je veux que le modèle passe DEVANT ce texte -> z-0 */}
<section className="relative z-0 min-h-screen flex ... py-24">
  <div className="reveal-text">
    <h2>Mon Nouveau Titre</h2>
  </div>
</section>
```

---

## 4. CHECKLIST ANTI-BUG 🛡️

Si quelque chose ne marche pas, vérifiez ces points :

1. **Le scroll est bloqué ?**
   - Vérifiez que la `div` du `Scene` (le modèle) a bien la classe `pointer-events-none`. Sinon, elle agit comme une vitre invisible qui empêche de toucher le site.

2. **Le modèle disparaît ?**
   - Vérifiez que le `Canvas` est bien en `fixed` et `h-screen`.
   - Vérifiez le fichier `3D_MODEL_GUIDE.md` pour les problèmes de "Frustum Culling".

3. **Le texte passe au travers du modèle bizarrement ?**
   - Vérifiez vos `z-index`. Avez-vous bien mis `z-0` ou `z-20` sur votre section ? Si vous oubliez le z-index, le comportement est imprévisible.

4. **Le site est lent ?**
   - Évitez les ombres trop complexes (`shadows` dans le Canvas).
   - Vérifiez que vous n'avez pas trop de `console.log` dans la boucle d'animation (`useFrame`).
