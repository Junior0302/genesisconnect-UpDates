# Guide Technique : Gestion des Modèles 3D Géants (React Three Fiber)

Ce document explique comment manipuler des modèles 3D de très grande taille (zoom sur le visage/buste) sans qu'ils disparaissent subitement de l'écran.

## Le Problème : "Frustum Culling"

Par défaut, Three.js optimise les performances en n'affichant pas les objets qu'il considère "hors champ". 

Quand on agrandit énormément un modèle (Scale > 10) et qu'on le descend très bas (Position Y < -20) pour ne montrer que sa tête :
1. Le centre du modèle (souvent au niveau des pieds ou du bassin) sort de l'écran par le bas.
2. Three.js calcule que "l'objet est sorti de l'écran".
3. **Résultat** : Le modèle disparaît brutalement, même si sa tête devrait être visible.

## La Solution : Désactiver le Frustum Culling

Pour éviter cela, il faut dire explicitement au moteur de **toujours calculer le rendu de cet objet**, même s'il pense qu'il est hors champ.

### Comment l'implémenter (Code)

Dans votre composant `Model.tsx` (ou équivalent), lors du parcours du maillage (traverse) :

```typescript
fbx.traverse((child) => {
  if ((child as THREE.Mesh).isMesh) {
    const mesh = child as THREE.Mesh;
    
    // ... configuration standard (ombres, matériaux) ...

    // 🚨 LA LIGNE CRITIQUE 🚨
    // Désactive l'optimisation de visibilité pour forcer l'affichage
    mesh.frustumCulled = false; 
  }
});
```

## Bonnes Pratiques & Pièges à Éviter

### À FAIRE ✅
1. **Désactiver `frustumCulled`** : C'est la solution n°1 pour les gros plans extrêmes.
2. **Utiliser une Caméra Stable** : Gardez une position de caméra reculée (Z > 15) et un FOV standard (30-45). Évitez de rapprocher la caméra physiquement pour zoomer (risque de clipping).
3. **Descendre le Modèle (Y)** : Pour cadrer le visage, descendez le modèle (Y négatif) plutôt que de monter la caméra. C'est plus simple à gérer mathématiquement.

### À ÉVITER ❌
1. **Ne pas Zoomer en avançant la caméra (Z < 5)** : Vous risquez de traverser le modèle (clipping) et de voir l'intérieur vide.
2. **Ne pas utiliser de FOV extrême (< 10)** : Cela crée un effet "téléobjectif" qui aplatit l'image et peut rendre le positionnement difficile.
3. **Ne pas oublier les ombres** : Si le modèle descend trop bas, vérifiez que les lumières le suivent ou sont assez larges pour l'éclairer.

---

*Ce guide a été généré suite à la résolution du bug de disparition du modèle "Genesis" lors du cadrage tête.*
