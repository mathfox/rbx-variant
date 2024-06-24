import { variation } from "./type";
import type {
	Func,
	PatchObjectOrPromise,
	RawVariant,
	VariantCreator,
	VariantOf,
	VariantTypeSpread,
} from "./precepts";
import type { Identity } from "./util";
import { isVariantCreator, type VariantRecord } from "./variant";
import { keys } from "@rbxts/phantom/src/Dictionary";

/**
 * Augment an existing variant model with new or overridden fields.
 *
 * @param variantDefinition a template for the variant, extends `RawVariant`, may be an existing variant.
 * @param f the augment function. This receives the object that is is augmenting, enabling calculated properties.
 * @tutorial
 * Use in conjunction with `variant` (or `variantModule`).
 *
 * ```typescript
 * // Add a timestamp to every action.
 * export const Action = variant(augment(
 *     {
 *         AddTodo: fields<{text: string, due?: number}>(),
 *         UpdateTodo: fields<{todoId: number, text?: string, due?: number, complete?: boolean}>(),
 *     },
 *     () => ({timestamp: Date.now()}),
 * ));
 * ```
 */
export function augment<
	T extends RawVariant,
	F extends (x: VariantOf<VariantRecord<T, string>>) => any,
>(variantDefinition: T, f: F) {
	return keys(variantDefinition).reduce((acc, key) => {
		let inputObject = variantDefinition[key];

		let returnFunc = isVariantCreator(inputObject)
			? variation(inputObject.output.type, (...args: unknown[]) => {
					const result = (inputObject as Func)(...args) as Identity<
						VariantTypeSpread<VariantRecord<T, string>>[keyof T]
					>;

					return {
						...f(result),
						...result,
					};
				})
			: (
					...args: T[typeof key] extends (...args: infer TArgs) => any
						? TArgs
						: []
				) => {
					let item = typeIs(inputObject, "function")
						? inputObject(...args)
						: {};

					return {
						...f(item),
						...item,
					};
				};

		return {
			...acc,
			[key]: returnFunc,
		};
	}, {}) as AugmentedRawVariant<T, F>;
}

type CleanResult<T, U> = T extends undefined
	? U
	: T extends Func
		? T
		: T extends object
			? U
			: T;

type FullyFuncRawVariant<V extends RawVariant> = {
	[P in keyof V & string]: CleanResult<V[P], () => {}>;
};

type PatchFunc<F, O extends object> = F extends (
	...args: infer TArgs
) => infer TReturn
	? TReturn extends {} | PromiseLike<{}>
		? (...args: TArgs) => PatchObjectOrPromise<TReturn, O>
		: never
	: never;

/**
 * A variant patched with an extra property.
 */
export type AugmentedRawVariant<V extends RawVariant, F extends Func> = {
	[P in keyof V]: V[P] extends VariantCreator<infer VT, infer VCF, infer VK>
		? VariantCreator<VT, PatchFunc<VCF, ReturnType<F>>, VK>
		: (
				...args: Parameters<FullyFuncRawVariant<V>[P & string]>
			) => Identity<
				ReturnType<F> & ReturnType<FullyFuncRawVariant<V>[P & string]>
			>;
};
