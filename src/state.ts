import { createInterface, type Interface } from "readline";
import { stdin, stdout } from "node:process";
import { PokeAPI, type Pokemon } from "./pokeapi.js";
import { commandExit } from "./command_exit.js";
import { commandHelp } from "./command_help.js";
import { commandMap } from "./command_map.js";
import { commandMapb } from "./command_mapb.js";
import { commandExplore } from "./command_explore.js";
import { commandCatch } from "./command_catch.js";
import { commandInspect } from "./command_inspect.js";
import { commandPokedex } from "./command_pokedex.js";

export type CLICommand = {
  name: string;
  description: string;
  callback: (state: State, ...args: string[]) => Promise<void>;
};

export type State = {
  rl: Interface;
  commands: Record<string, CLICommand>;
  pokeapi: PokeAPI;
  nextLocationsURL: string | null;
  prevLocationsURL: string | null;
  pokedex: Record<string, Pokemon>;
};

export function initState(): State {
  const rl = createInterface({
    input: stdin,
    output: stdout,
    prompt: "Pokedex > ",
  });

  const commands: Record<string, CLICommand> = {
    map: {
      name: "map",
      description: "Get the next page of location areas",
      callback: commandMap,
    },
    mapb: {
      name: "mapb",
      description: "Get the previous page of location areas",
      callback: commandMapb,
    },
    explore: {
      name: "explore",
      description: "Explore a location area: explore <area_name>",
      callback: commandExplore,
    },
    catch: {
      name: "catch",
      description: "Try to catch a Pokemon: catch <pokemon_name>",
      callback: commandCatch,
    },
    inspect: {
      name: "inspect",
      description: "Inspect a caught Pokemon: inspect <pokemon_name>",
      callback: commandInspect,
    },
    pokedex: {
      name: "pokedex",
      description: "List all the Pokemon you've caught",
      callback: commandPokedex,
    },
    help: {
      name: "help",
      description: "Displays a help message",
      callback: commandHelp,
    },
    exit: {
      name: "exit",
      description: "Exit the Pokedex",
      callback: commandExit,
    },
    // can add more commands here
  };

  return {
    rl,
    commands,
    pokeapi: new PokeAPI(1000 * 60 * 5),
    nextLocationsURL: null,
    prevLocationsURL: null,
    pokedex: {},
  };
}
