/* Beatrice — script della pagina. Nessuna dipendenza, nessuna richiesta di rete.
   Senza JavaScript la pagina resta completa: qui ci sono solo miglioramenti. */

(function () {
  "use strict";

  var radice = document.documentElement;
  var movimentoRidotto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --- Menu mobile ------------------------------------------------------- */
  /* <dialog> modale: Esc lo chiude da solo e alla chiusura il browser
     riporta il focus sul bottone «Menu». Qui gestiamo aria-expanded,
     il focus intrappolato e la chiusura quando si sceglie una sezione. */

  var bottoneMenu = document.querySelector(".intestazione .menu-bottone");
  var pannello = document.getElementById("menu");

  if (bottoneMenu && pannello && typeof pannello.showModal === "function") {
    var desktop = window.matchMedia("(min-width: 64em)");

    var apertoAlle = 0;

    var chiudiMenu = function () {
      if (pannello.open) pannello.close();
    };

    bottoneMenu.addEventListener("click", function () {
      apertoAlle = Date.now();
      pannello.showModal();
      bottoneMenu.setAttribute("aria-expanded", "true");
    });

    // «Chiudi» sta dove c'era «Menu»: un doppio tocco aprirebbe e chiuderebbe
    // subito il pannello, quindi i tocchi nel primo mezzo secondo si ignorano
    pannello.querySelector("[data-menu-chiudi]").addEventListener("click", function () {
      if (Date.now() - apertoAlle < 500) return;
      chiudiMenu();
    });

    pannello.addEventListener("close", function () {
      bottoneMenu.setAttribute("aria-expanded", "false");
    });

    // Tab e Maiusc+Tab girano solo dentro il pannello
    pannello.addEventListener("keydown", function (evento) {
      if (evento.key !== "Tab") return;
      var elementi = pannello.querySelectorAll("a[href], button:not([disabled])");
      var primo = elementi[0];
      var ultimo = elementi[elementi.length - 1];
      // Anche dal pannello stesso (dopo un clic su una zona vuota)
      var suPrimo = document.activeElement === primo || document.activeElement === pannello;
      if (evento.shiftKey && suPrimo) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primo.focus();
      }
    });

    // Scelta una sezione: chiude il pannello e porta lì scorrimento e focus
    pannello.addEventListener("click", function (evento) {
      // Ctrl/Cmd/Maiusc+clic e clic centrale restano al browser (nuova scheda)
      if (evento.button !== 0 || evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey) return;
      var link = evento.target.closest('a[href^="#"]');
      if (!link) return;
      var ancora = link.getAttribute("href");
      var destinazione = document.getElementById(ancora.slice(1));
      if (!destinazione) return;
      evento.preventDefault();
      chiudiMenu();
      if (location.hash !== ancora) history.pushState(null, "", ancora);
      // Il focus va sul titolo della sezione, così Tab riparte da lì
      var titolo = destinazione.querySelector("h2") || destinazione;
      titolo.setAttribute("tabindex", "-1");
      titolo.focus({ preventScroll: true });
      destinazione.scrollIntoView({ behavior: movimentoRidotto ? "auto" : "smooth" });
    });

    // Se la finestra diventa larga il menu non serve più
    desktop.addEventListener("change", function (evento) {
      if (evento.matches) chiudiMenu();
    });

    radice.classList.add("menu-pronto");
  }

  /* --- Giorno corrente negli orari ---------------------------------------- */
  /* Il giorno si calcola nel fuso di Ancona, non in quello del telefono.
     Si ricalcola quando la scheda torna visibile: una pagina lasciata aperta
     di notte non resta ferma a ieri. */

  var segnaOggi = function () {
    var oggi;
    try {
      oggi = new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        timeZone: "Europe/Rome"
      }).format(new Date());
    } catch (errore) {
      return; // Browser senza supporto ai fusi orari: la tabella resta com'è
    }

    var precedente = document.querySelector(".orari .oggi");
    if (precedente) {
      if (precedente.getAttribute("data-giorno") === oggi) return;
      precedente.classList.remove("oggi");
      precedente.removeAttribute("aria-current");
      var vecchia = precedente.querySelector(".oggi-etichetta");
      if (vecchia) vecchia.parentNode.removeChild(vecchia);
      precedente.querySelector("th").normalize();
      var nome = precedente.querySelector("th").firstChild;
      if (nome) nome.nodeValue = nome.nodeValue.replace(/\s+$/, "");
    }

    var riga = document.querySelector('.orari [data-giorno="' + oggi + '"]');
    if (!riga) return;
    riga.classList.add("oggi");
    riga.setAttribute("aria-current", "date");
    var etichetta = document.createElement("span");
    etichetta.className = "etichetta oggi-etichetta";
    etichetta.textContent = "Oggi";
    // Lo spazio separa le parole per i lettori di schermo («Venerdì Oggi»)
    // e permette alla riga di andare a capo sugli schermi stretti
    var th = riga.querySelector("th");
    th.appendChild(document.createTextNode(" "));
    th.appendChild(etichetta);
  };

  segnaOggi();
  window.addEventListener("pageshow", segnaOggi);
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") segnaOggi();
  });

  /* --- Comparsa degli elementi ------------------------------------------- */
  /* Una sola volta per elemento. Con movimento ridotto o senza
     IntersectionObserver non si nasconde nulla. */

  if (movimentoRidotto || !("IntersectionObserver" in window)) return;

  radice.classList.add("anima");

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
