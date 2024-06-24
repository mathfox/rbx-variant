import { type FlagsFunc, flagsImpl } from "./flags";
import { type IsOfVariantFunc, isOfVariantImpl } from "./isOfVariant";
import { type IsTypeFunc, isTypeImpl } from "./isType";
import { type MatchFuncs, matchImpl } from "./match";
import { type MatcherFunc, matcherImpl } from "./matcher";
import { type RemoteFuncs, remoteImpl } from "./remote";
import { type TypedFunc, typedImpl } from "./typed";
import { type TypesFunc, typesImpl } from "./types";
import { type VariantFuncs, variantImpl } from "./variant";

/**
 * All the functions in the library that pivot on a certain discriminant.
 */
export interface VariantCosmos<K extends string>
	extends IsOfVariantFunc<K>,
		IsTypeFunc<K>,
		FlagsFunc<K>,
		MatchFuncs<K>,
		MatcherFunc<K>,
		RemoteFuncs<K>,
		TypedFunc<K>,
		TypesFunc<K>,
		VariantFuncs<K> {
	key: K;
}

export interface VariantCosmosConfig<K extends string> {
	/**
	 * The discriminant to be used by these functions.
	 */
	key: K;
}

/**
 * Generate a series of functions to work off a given key.
 * @param config the key to use.
 * @template K discriminant as string literal.
 * @returns `VariantCosmos<K>`
 */
export function variantCosmos<K extends string>({
	key,
}: VariantCosmosConfig<K>): VariantCosmos<K> {
	const { isType } = isTypeImpl(key);
	const { flags } = flagsImpl(key);

	return {
		key,
		isType,
		flags,
		...isOfVariantImpl(key),
		...matchImpl(key),
		...matcherImpl(key),
		...remoteImpl(key),
		...typedImpl(key),
		...typesImpl(key),
		...variantImpl(key),
	};
}
