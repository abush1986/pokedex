import { Cache } from "./pokecache.js";

export class PokeAPI {
  private static readonly baseURL = "https://pokeapi.co/api/v2";

  #cache: Cache;

  constructor(cacheInterval: number) {
    this.#cache = new Cache(cacheInterval);
  }

  async fetchLocations(pageURL?: string): Promise<ShallowLocations> {
    const url = pageURL ?? `${PokeAPI.baseURL}/location-area`;

    const cached = this.#cache.get<ShallowLocations>(url);
    if (cached) {
      return cached;
    }

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(
        `Failed to fetch locations: ${res.status} ${res.statusText}`,
      );
    }

    const locations = (await res.json()) as ShallowLocations;
    this.#cache.add(url, locations);
    return locations;
  }

  async fetchLocation(locationName: string): Promise<Location> {
    const url = `${PokeAPI.baseURL}/location-area/${locationName}`;

    const cached = this.#cache.get<Location>(url);
    if (cached) {
      return cached;
    }

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(
        `Failed to fetch location '${locationName}': ${res.status} ${res.statusText}`,
      );
    }

    const location = (await res.json()) as Location;
    this.#cache.add(url, location);
    return location;
  }

  async fetchPokemon(pokemonName: string): Promise<Pokemon> {
    const url = `${PokeAPI.baseURL}/pokemon/${pokemonName}`;

    const cached = this.#cache.get<Pokemon>(url);
    if (cached) {
      return cached;
    }

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(
        `Failed to fetch pokemon '${pokemonName}': ${res.status} ${res.statusText}`,
      );
    }

    const pokemon = (await res.json()) as Pokemon;
    this.#cache.add(url, pokemon);
    return pokemon;
  }
}

// A single named resource (name + URL to its details).
export type NamedAPIResource = {
  name: string;
  url: string;
};

// The paginated batch of location areas returned by the list endpoint.
export type ShallowLocations = {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedAPIResource[];
};

// The detailed location-area object returned when fetching a single location.
export type Location = {
  id: number;
  name: string;
  pokemon_encounters: {
    pokemon: NamedAPIResource;
  }[];
};

// The detailed Pokemon object returned by the pokemon endpoint.
export type Pokemon = {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  weight: number;
  stats: {
    base_stat: number;
    stat: NamedAPIResource;
  }[];
  types: {
    type: NamedAPIResource;
  }[];
};
