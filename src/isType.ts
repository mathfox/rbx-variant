import type { Func, VariantCreator } from "./precepts";
import type { TypeStr } from "./util";

export interface IsTypeFunc<K extends string> {
	/**
	 * Check if an object is a variant of some type.
	 * @param type any type string or variant creator
	 * @returns A user-defined type guard indicating if the instance is of a given type.
	 */
	isType<T extends string | VariantCreator<string, Func, K>>(
		this: void,
		type: T,
	): <O extends Record<K, string>>(
		object: O,
	) => object is Extract<O, Record<K, TypeStr<T, K>>>;
	/**
	 * Check if an object is a variant of some type.
	 * @param object an instance of an object
	 * @param type any type string or variant creator
	 * @returns A user-defined type guard indicating if the instance is of a given type.
	 */
	isType<
		O extends Record<K, string>,
		T extends O[K] | VariantCreator<O[K], Func, K>,
	>(
		this: void,
		object: O | undefined,
		type: T,
	): object is Extract<O, Record<K, TypeStr<T, K>>>;
}

export function isTypeImpl<K extends string>(key: K): IsTypeFunc<K> {
	function isType<T extends string | VariantCreator<string, Func, K>>(
		type: T,
	): <O extends Record<K, T>>(
		object: O,
	) => object is Extract<O, Record<K, TypeStr<T, K>>>;
	function isType<
		O extends Record<K, T>,
		T extends string | VariantCreator<string, Func, K>,
	>(
		object: O | undefined,
		type: T,
	): object is Extract<O, Record<K, TypeStr<T, K>>>;
	function isType<
		T extends O[K] | VariantCreator<O[K], Func, K>,
		O extends Record<K, string>,
	>(instanceOrType: O | {} | undefined | T, t?: T) {
		if (instanceOrType !== undefined) {
			if (
				typeIs(instanceOrType, "function") ||
				typeIs(instanceOrType, "string")
			) {
				const typeArg = instanceOrType as T;
				const typeStr = typeIs(typeArg, "string")
					? typeArg
					: (typeArg as VariantCreator<string, any, K>).output.type;

				return <O extends Record<K, string>>(
					o: O,
				): o is Extract<O, Record<K, TypeStr<T, K>>> => isType(o, typeStr);
			} else {
				const instance = instanceOrType as O;

				const typeStr = typeIs(t, "string")
					? t
					: (t as VariantCreator<string, any, K>).output.type;
				return (
					instance !== undefined &&
					(instance as Record<K, string>)[key ?? "type"] === typeStr
				);
			}
		} else {
			return false;
		}
	}

	return { isType };
}
