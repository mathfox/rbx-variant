import { map } from "@rbxts/phantom/src/Array";
import { flagsImpl } from "./flags";
import type {
	Func,
	Outputs,
	PatchObjectOrPromise,
	RawVariant,
	Stringable,
	TypeNames,
	TypesOf,
	VariantOf,
} from "./precepts";
import { variantImpl } from "./variant";

type primitive = number | string | boolean;

const GENERIC_BRAND: unique symbol = {
	__brand: "VARIANT GENERIC TEMPLATE",
} as any;

/**
 * Announce to the world (specifically `variant`/`variantModule`) that
 */
export type GenericTemplate<T extends RawVariant> = T & {
	// ROBLOX DEVIATION: undefined will be omiited, so we have to use boolean
	[GENERIC_BRAND]: true;
};
/**
 * Define a generic variant
 * @param func a template factory. Receives 26 generic placeholders (A-Z) in an object, returns a variant template
 * @returns A variant with generic creators
 */
export function onTerms<T extends RawVariant>(
	func: (alpha: Alpha) => T,
): GenericTemplate<T> {
	return {
		...func(Alpha),
		// ROBLOX DEVIATION: undefined will be omiited, so we have to use boolean
		[GENERIC_BRAND]: true,
	};
}
const GTERM = "__term";
// special functions keyed to the type used for generic parameters.
const genericTerms = variantImpl(GTERM).variant;
const flags = flagsImpl(GTERM).flags;

/**
 * A placeholder type representing a generic parameter.
 */
export interface GenericTerm<Label extends string> {
	[GTERM]: Label;
}

/**
 * Generic equivalent of `VariantCreator`
 *
 * Miraculously, by holding the pre-`Generify`'d functions as a type
 * parameter, we can actually inspect and extract those types for
 * `GVariantOf`. This is what allows the interface without the __Name object.
 */
export type GenericVariantCreator<
	Type extends string,
	F extends (...args: Array<any>) => {} = () => {},
	K extends string = "type",
> = (<T>(
	...args: Generify<Parameters<F>, { [gp: string]: T }>
) => Generify<
	PatchObjectOrPromise<ReturnType<F>, Record<K, Type>>,
	{ [gp: string]: T }
>) &
	Outputs<K, Type> &
	Stringable<Type> & {
		name: Type;
	};

/**
 * Generic equivalent of `VariantTypeSpread`.
 *
 * Mapped type of keys to the variant creator's return type.
 */
export type GenericVariantTypeSpread<
	VM extends GenericVariantRecord<{}, string>,
> = {
	[P in keyof VM]: VM[P] extends GenericVariantCreator<
		infer Type,
		infer Creator,
		infer K
	>
		? PatchObjectOrPromise<ReturnType<Creator>, Record<K, Type>>
		: never;
};

/**
 * Generic Variant Of.
 */
export type GVariantOf<
	VM extends GenericVariantRecord<{}, string>,
	TType extends TypeNames<VM>,
	Map extends { [gp: string]: any },
> = TType extends keyof VM
	? Generify<GenericVariantTypeSpread<VM>[TType], Map>
	: Generify<GenericVariantTypeSpread<VM>[keyof VM], Map>;
/**
 * The money.
 */
export type GenericVariantRecord<VM extends RawVariant, K extends string> = {
	[P in keyof VM]: GenericVariantCreator<
		P & string,
		VM[P] extends Func ? VM[P] : () => {},
		K
	>;
};

const GP = genericTerms([
	"A",
	"B",
	"C",
	"D",
	"E",
	"F",
	"G",
	"H",
	"I",
	"J",
	"K",
	"L",
	"M",
	"N",
	"O",
	"P",
	"Q",
	"R",
	"S",
	"T",
	"U",
	"V",
	"W",
	"X",
	"Y",
	"Z",
]);
export type GP<T extends TypeNames<typeof GP> = undefined> = VariantOf<
	typeof GP,
	T
>;

/**
 * Object with placeholders for generic terms.
 */
export const Alpha = flags(map(GP, (f) => f()));
/**
 * Type with placeholders for generic terms.
 */
export type Alpha = {
	[P in TypesOf<typeof GP>]: GenericTerm<P>;
};

interface TermMap {
	[term: string]: any;
}

/**
 * Transform some type containing a `GenericTerm` into the concrete type from
 * the term map.
 */
export type Generify<T, Map extends TermMap> = T extends GenericTerm<
	infer Label
>
	? Map[Label]
	: T extends primitive
		? T
		: T extends ReadonlyArray<any>
			? { [P in keyof T]: Generify<T[P], Map> }
			: T extends (...args: infer Args) => infer Return
				? (...args: Generify<Args, Map>) => Generify<Return, Map>
				: T extends object
					? { [P in keyof T]: Generify<T[P], Map> }
					: T;
