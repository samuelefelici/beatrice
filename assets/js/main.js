/* Beatrice — script della pagina. Nessuna dipendenza, nessuna richiesta di rete.
   Senza JavaScript la pagina resta completa: qui ci sono solo miglioramenti. */

(function () {
  "use strict";

  var radice = document.documentElement;
  var movimentoRidotto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --- Comparsa degli elementi ------------------------------------------- */
  /* Una sola volta per elemento. Con movimento ridotto o senza
     IntersectionObserver non si nasconde nulla. */

  if (movimentoRidotto || !("IntersectionObserver" in window)) return;

  radice.classList.add("js");

  var osservatore = new IntersectionObserver(
    function (voci) {
      voci.forEach(function (voce) {
        if (!voce.isIntersecting) return;
        voce.target.classList.add("visibile");
        osservatore.unobserve(voce.target);
      });
    },
    { rootMargin: "0px 0px -10% 0px" }
  );

  document.querySelectorAll(".rivela").forEach(function (elemento) {
    osservatore.observe(elemento);
  });
})();
