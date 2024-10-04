import type { Func, VariantCreator } from "./precepts";

/**
 * Collapse a complex type into a more easily read object.
 */
export type Identity<TValue> = TValue extends object
	? {} & {
			[TKey in keyof TValue]: TValue[TKey];
		}
	: TValue;

/**
 * https://github.com/microsoft/TypeScript/issues/31751#issuecomment-498526919
 */
export type IsNever<TInput> = [TInput] extends [never] ? true : false;

/**
 * Identity function. Doubles as the noop func.
 * @param x
 */
export const identityFunc = <TInpu>(x = {} as TInpu) => x as TInpu extends unknown ? {} : TInpu;

/**
 * Extract a type string from either a string or `VariantCreator`
 */
export type TypeStr<
	T extends string | VariantCreator<string, Func, K>,
	K extends string = "type",
> = T extends VariantCreator<infer R, Func, K> ? R : T extends string ? T : never;

/**
 * **H**igher-**O**rder **I**dentity.
 *
 * A higher order factory for this very useful wrapper function.
 *
 * ```ts
 * // Enforce the type constraint *and* narrow the return type.
 * function defineThing<T extends Template>(definition: T): T {
 *     return definition;
 * }
 * ```
 *
 * The above `defineThing` can now be generated through
 *
 * ```ts
 * const defineThing = HOI<Template>();
 * ```
 *
 * Or in more advanced to define something like a catalog:
 *
 * ```ts
 * const defineThings = HOI<Record<string, Template>>();
 * ```
 */
export const HOI =
	<TConstraint>() =>
	<TDefinition extends TConstraint>(definition: TDefinition) =>
		definition;
