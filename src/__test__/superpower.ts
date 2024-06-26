import { catalog } from "../catalog";
import type { TypeNames, VariantOf } from "../precepts";
import { variant } from "../type";
import { fields } from "../variant.tools";

export const Superpower = variant({
	/**
	 * Fly through the air.
	 */
	Flight: fields<{
		/**
		 * Speed in meters / second.
		 */
		speed: number;
		/**
		 * Airtime in seconds.
		 */
		stamina: number;
	}>(),
	/**
	 *
	 */
	Invisibility: fields<{
		/**
		 * How their invisibility works.
		 *
		 * - **psychic** will fool people.
		 * - **light manipulation** will fool cameras.
		 */
		method: "psychic" | "light manipulation";
	}>(),
	/**
	 * The ability to pass through solid matter.
	 */
	Phasing: {},
	/**
	 * Jump from one place to another instantly.
	 */
	Teleportation: fields<{
		/**
		 * Range in meters.
		 */
		range: number;
	}>(),
});
export type Superpower<T extends TypeNames<typeof Superpower> = undefined> =
	VariantOf<typeof Superpower, T>;

export const Element = catalog(["fire", "air", "water", "earth"]);
export type Element = keyof typeof Element;
