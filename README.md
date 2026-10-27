# Portfolio-2027

Un portfolio qui retrace qui je suis, mes compétences et mes projets.

## Sprint 1 : la maquette

Le dossier [`maquette/`](maquette/) contient la maquette statique du design (HTML, CSS et un peu de JavaScript, sans dépendance) :

- `index.html` + `fiche.css` : la fiche de personnel (papier blanc, photo trombonée, journal de missions, pièces jointes vidéo de la planète) et la tablette MJ-PAD à droite ;
- `styleguide.html` : la planche de style (palettes des deux thèmes, contrastes WCAG, typographies, mouvement) ;
- `parcours-universitaire.html` + `parcours-data.js` : page annexe avec le détail des semestres. Pour la retirer, supprimer ces deux fichiers et le lien « Détail des semestres » dans `index.html`.

Pour la voir en local :

```bash
cd maquette && python3 -m http.server 8000
# puis http://localhost:8000
```

Elle est publiée sur GitHub Pages par `.github/workflows/pages.yml` à chaque push sur `main`. Le site Next.js remplacera cette maquette au sprint 2.
