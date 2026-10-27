# Portfolio-2027

Un portfolio qui retrace qui je suis, mes compétences et mes projets.

## Sprint 1 : la maquette

Le dossier [`maquette/`](maquette/) contient la maquette statique du design (HTML, CSS et un peu de JavaScript, sans dépendance) :

- `index.html` : toute la page, en thème sombre et clair, avec les cartes projets cliquables et l'esquisse de la planète ;
- `styleguide.html` : la planche de style (palettes des deux thèmes, contrastes WCAG, typographies, mouvement) ;
- `parcours-universitaire.html` + `parcours-data.js` : page annexe avec le détail des semestres. Pour la retirer, supprimer ces deux fichiers et le lien « Détail des semestres » dans `index.html`.

Pour la voir en local :

```bash
cd maquette && python3 -m http.server 8000
# puis http://localhost:8000
```

Elle est publiée sur GitHub Pages par `.github/workflows/pages.yml` à chaque push sur `main`. Le site Next.js remplacera cette maquette au sprint 2.
