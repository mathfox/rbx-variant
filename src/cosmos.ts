import { type IsOfVariantFunc, isOfVariantImpl } from "./isOfVariant";
import { type IsTypeFunc, isTypeImpl } from "./isType";
import { type MatchFuncs, matchImpl } from "./match";
import { type MatcherFunc, matcherImpl } from "./matcher";
import { type RemoteFuncs, remoteImpl } from "./remote";
import { type VariantFuncs, variantImpl } from "./variant";

/**
 * All the functions in the library that pivot on a certain discriminant.
 */
export interface VariantCosmos<K extends string>
	extends IsOfVariantFunc<K>,
		IsTypeFunc<K>,
		MatchFuncs<K>,
		MatcherFunc<K>,
		RemoteFuncs<K>,
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
export function variantCosmos<K extends string>({ key }: VariantCosmosConfig<K>): VariantCosmos<K> {
	const { isType } = isTypeImpl(key);

	return {
		key,
		isType,
		...isOfVariantImpl(key),
		...matchImpl(key),
		...matcherImpl(key),
		...remoteImpl(key),
		...variantImpl(key),
	};
}
