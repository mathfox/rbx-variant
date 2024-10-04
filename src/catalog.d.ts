import type { Catalog } from "./types";

/**
 * Create a catalog object from a set of strings.
 *
 * @param strings (`string[]`) - list of string literals
 * @returns a string enum
 *
 * @tutorial
 * ```ts
 * const Suit = catalog(['Spades', 'Hearts', 'Clubs', 'Diamonds']);
 * type Suit = keyof typeof Suit;
 * ```
 * `Suit` is now available as both value (`return Suit.Spades`) and type (`function(cardSuit: Suit) { ... }`)
 */
declare function catalog<TInput extends string>(strings: ReadonlyArray<TInput>): Catalog<TInput>;

export = catalog;
