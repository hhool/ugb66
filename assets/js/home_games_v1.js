(function () {
  const grid = document.getElementById("home-games-grid");
  if (!grid) {
    return;
  }

  const MAX_HOME_GAMES = 48;

  function renderFallbackMessage() {
    grid.innerHTML = '<div class="text-muted fs-sm">Games are loading. Please refresh if this message stays here.</div>';
  }

  function buildCardFromNode(sourceNode) {
    const href = sourceNode.getAttribute("href") || "#";
    const image = sourceNode.querySelector("img");
    const titleNode = sourceNode.querySelector("h3");

    if (!image || !titleNode) {
      return null;
    }

    const imgSrc = image.getAttribute("src") || "";
    const imgAlt = image.getAttribute("alt") || titleNode.textContent.trim();
    const title = titleNode.textContent.trim();

    const card = document.createElement("a");
    card.className = "card";
    card.href = href;
    card.innerHTML =
      '<picture><img class="img-fluid" width="126" height="126"></picture>' +
      '<div class="card-body"><h3></h3></div>';

    const outImage = card.querySelector("img");
    const outTitle = card.querySelector("h3");

    outImage.src = imgSrc;
    outImage.alt = imgAlt;
    outTitle.textContent = title;

    return card;
  }

  function shuffle(items) {
    const clone = items.slice();
    for (let i = clone.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = clone[i];
      clone[i] = clone[j];
      clone[j] = temp;
    }
    return clone;
  }

  fetch("/search.html", { credentials: "same-origin" })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Failed to load search page");
      }
      return response.text();
    })
    .then(function (html) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const gameNodes = Array.from(doc.querySelectorAll("a.game-item"));

      if (!gameNodes.length) {
        renderFallbackMessage();
        return;
      }

      const selectedNodes = shuffle(gameNodes).slice(0, MAX_HOME_GAMES);
      const cards = selectedNodes
        .map(buildCardFromNode)
        .filter(function (card) {
          return Boolean(card);
        });

      if (!cards.length) {
        renderFallbackMessage();
        return;
      }

      const fragment = document.createDocumentFragment();
      cards.forEach(function (card) {
        fragment.appendChild(card);
      });

      grid.innerHTML = "";
      grid.appendChild(fragment);
    })
    .catch(function () {
      renderFallbackMessage();
    });
})();
