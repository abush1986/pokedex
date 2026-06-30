import type { State } from "./state.js";

export async function commandCatch(
  state: State,
  ...args: string[]
): Promise<void> {
  const name = args[0];
  if (!name) {
    console.log("Please provide a pokemon to catch: catch <pokemon_name>");
    return;
  }

  console.log(`Throwing a Pokeball at ${name}...`);

  const pokemon = await state.pokeapi.fetchPokemon(name);

  // The higher a Pokemon's base experience, the harder it is to catch.
  const catchChance = Math.random() * pokemon.base_experience;
  if (catchChance > 50) {
    console.log(`${name} escaped!`);
    return;
  }

  console.log(`${name} was caught!`);
  console.log("You may now inspect it with the inspect command.");
  state.pokedex[name] = pokemon;
}
