export type Catalog<in T extends string = string> = {
	readonly [Key in T]: Key;
};

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
export function catalog<T extends string>(strings: ReadonlyArray<T>): Catalog<T> {
	const catalog: Record<string, unknown> = {};

	for (const key of strings) {
		catalog[key] = key;
	}

	return catalog as Catalog;
}
