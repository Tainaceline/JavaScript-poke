const form = document.querySelector("#search-form");
const input = document.querySelector("#pokemon-name");
const button = document.querySelector("#search-button");
const message = document.querySelector("#message");
const card = document.querySelector("#pokemon-card");
const image = document.querySelector("#pokemon-image");
const number = document.querySelector("#pokemon-number");
const name = document.querySelector("#pokemon-result-name");
const types = document.querySelector("#pokemon-types");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const pokemonName = input.value.trim().toLowerCase();
  if (!pokemonName) {
    message.textContent = "Digite o nome de um Pokémon para pesquisar.";
    message.className = "message message--error";
    input.focus();
    return;
  }

  button.disabled = true;
  card.hidden = true;
  message.textContent = "Procurando seu Pokémon...";
  message.className = "message message--loading";

  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(pokemonName)}`,
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Pokémon não encontrado. Confira o nome e tente novamente.");
      }
      throw new Error("Não foi possível consultar a PokéAPI. Tente novamente.");
    }

    const pokemon = await response.json();
    const artwork = pokemon.sprites.other["official-artwork"].front_default;
    const sprite = pokemon.sprites.front_default;
    const pokemonImage = artwork || sprite;

    if (!pokemonImage) {
      throw new Error("A imagem deste Pokémon não está disponível.");
    }

    image.src = pokemonImage;
    image.alt = `Imagem de ${pokemon.name}`;
    number.textContent = `Nº ${String(pokemon.id).padStart(3, "0")}`;
    name.textContent = pokemon.name;
    types.replaceChildren(
      ...pokemon.types.map(({ type }) => {
        const badge = document.createElement("span");
        badge.className = "type-badge";
        badge.textContent = type.name;
        return badge;
      }),
    );
    card.hidden = false;
    message.textContent = "Pokémon encontrado!";
    message.className = "message";
  } catch (error) {
    message.textContent =
      error instanceof Error
        ? error.message
        : "Ocorreu um erro inesperado. Tente novamente.";
    message.className = "message message--error";
  } finally {
    button.disabled = false;
  }
});
