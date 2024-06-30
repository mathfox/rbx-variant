import { isArray } from "@rbxts/phantom/src/Array";
import { values } from "@rbxts/phantom/src/Dictionary";
import type { Func, TypesOf, VariantCreator, VariantModule } from "./precepts";
import type { Identity } from "./util";
import { isVariantCreator } from "./variant";

export interface TypesFunc<K extends string> {
	/**
	 * Get the list of types from a variant.
	 * @param content some variant definition.
	 * @template T target discriminated union
	 * @returns list of string literal types.
	 */
	types<T extends VariantModule<K>>(
		this: void,
		content: T,
	): Array<Identity<TypesOf<T>>>;
	/**
	 * Get the list of types from a list of variant creators.
	 * @param content list of variant creators.
	 * @template T target discriminated union
	 * @returns list of string literal types.
	 */
	types<C extends VariantCreator<string, Func, K>>(
		this: void,
		content: Array<C>,
	): Array<C["output"]["type"]>;
	/**
	 * Get the list of types from the instances of a variant.
	 * @param content list of instances.
	 * @template T target discriminated union
	 * @returns list of string literal types.
	 */
	types<T extends Record<K, string>>(this: void, content: Array<T>): Array<T[K]>;
}

export function typesImpl<K extends string>(key: K): TypesFunc<K> {
	function types(
		content:
			| VariantModule<K>
			| Array<VariantCreator<string, Func, K>>
			| Array<Record<K, string>>,
	) {
		if (isArray(content)) {
			if (!content.isEmpty() && isVariantCreator(content[0])) {
				return (content as Array<VariantCreator<string, Func, K>>).map(
					(c) => c.output.type,
				);
			} else {
				return (content as Array<Record<K, string>>).map((c) => c[key]);
			}
		} else {
			return values(content).map((c) => c.output.type);
		}
	}

	return { types };
}
