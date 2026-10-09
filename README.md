# Beatrice — sito del negozio

Sito di una pagina per Beatrice (intimo, calze e abbigliamento donna, Pietralacroce, Ancona).
HTML, CSS e JavaScript vanilla, senza framework e senza build. Pubblicato con GitHub Pages.

## Struttura

| Percorso | Contenuto |
| --- | --- |
| `index.html` | la pagina |
| `assets/css/style.css` | token di colore, tipografia, superfici, componenti |
| `assets/js/main.js` | miglioramenti progressivi (comparsa degli elementi) |
| `assets/fonts/` | Archivo variabile e Space Mono 400, woff2 subset latin, con licenze OFL |
| `.nojekyll` | dice a GitHub Pages di servire i file così come sono |

## Provarlo in locale

```sh
python3 -m http.server 8080
```

Poi aprire `http://localhost:8080/`.

## Regole del sistema visivo

- Solo i sei token in `:root`. Le sezioni alternano `.fondo-avorio` e `.fondo-bruno`; `.fondo-profondo` è solo per footer e barra fissa.
- Il bordeaux si usa solo su avorio. Su bruno il testo è avorio e almeno 18px.
- Raggio 0, niente ombre, niente card: la struttura la fanno i filetti da 1px (`.righe`, `.filetto`, `.griglia`).
- Il logo è solo l’SVG originale: finché manca c’è un segnaposto, mai un corsivo ricostruito.
- Nessuna richiesta a terze parti: font self-hosted, niente embed, niente analytics.

## Font

- Archivo (variabile, assi `wdth` 62–125 e `wght` 100–900) — The Archivo Project Authors, SIL OFL 1.1.
- Space Mono 400 — The Space Mono Project Authors, SIL OFL 1.1.

I file woff2 vengono dai pacchetti Fontsource (`@fontsource-variable/archivo` 5.3.0, `@fontsource/space-mono` 5.3.0), già ridotti al sottoinsieme latin.
