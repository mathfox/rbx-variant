import { assign, entries, keys } from "@rbxts/phantom/src/Dictionary";
import { GenericTemplate, GenericVariantRecord } from "./generic";
import type { Func, RawVariant, VariantCreator } from "./precepts";
import { type Identity, identityFunc } from "./util";
import { isArray } from "@rbxts/phantom/src/Array";

/**
 * A variant rendered as an object.
 */
export type VariantRecord<T extends RawVariant, K extends string> = {
	[P in keyof T]: T[P] extends VariantCreator<string, Func, string>
		? T[P]
		: VariantCreator<
				`${Exclude<P, symbol>}`,
				T[P] extends Func ? T[P] : () => {},
				K
			>;
};

type ValidListType = string | VariantCreator<string, Func, string>;
type CreatorFromListType<
	T extends ValidListType,
	K extends string,
> = T extends VariantCreator<string, Func, string>
	? T
	: T extends string
		? VariantCreator<T, () => {}, K>
		: never;

/**
 * Variant-Module-From-Variant-Creator(s)
 *
 * Create something that satisfies `VariantModule<K>` from some `VariantCreator`.
 */
export type VMFromVC<T extends VariantCreator<string, Func, string>> = {
	[P in T["output"]["type"]]: Extract<T, Record<"output", Record<"type", P>>>;
};

type CleanResult<T, U> = T extends undefined
	? U
	: T extends Func
		? T
		: T extends object
			? U
			: T;

type ScopedVariant<T extends RawVariant, Scope extends string> = {
	[P in keyof T & string]: VariantCreator<
		ScopedType<Scope, P>,
		CleanResult<T[P], () => {}>
	>;
};

/**
 * TS 4.1-compatible scoped type.
 */
type ScopedType<Scope extends string, Type extends string> = `${Scope}/${Type}`;

/**
 * Internal function to consistently generate a scoped type.
 * @param scope
 * @param type
 * @returns
 */
export const scopeType = <Scope extends string, Type extends string>(
	scope: Scope,
	t: Type,
) => `${scope}/${t}` as ScopedType<Scope, Type>;

function descopeType<S extends string, T extends string>(
	s: ScopedType<S, T>,
): T {
	return (s.split("/")[1] ?? s) as T;
}

const VARIANT_CREATOR_BRAND: unique symbol = {
	__brand: "Variant Creator",
} as any;

/**
 * Checks whether the provided value is a table with branded member
 */
export function isVariantCreator(
	value: unknown,
): value is VariantCreator<string> {
	return typeIs(value, "table") && VARIANT_CREATOR_BRAND in value;
}

export interface VariantFuncs<K extends string> {
	/**
	 * Strip the scope prefix from an object passed into `match`
	 * @param target object used as the match target.
	 *
	 * @tutorial
	 * ```ts
	 * match(descope(target), {
	 *     ...,
	 * })
	 * ```
	 */
	descope<T extends Record<K, ScopedType<string, string>>>(
		this: void,
		target: T,
	): T extends Record<K, ScopedType<string, infer TType>>
		? Identity<Omit<T, K> & Record<K, TType>>
		: T;
	/**
	 *
	 * @param scope
	 * @param v
	 */
	scoped<T extends RawVariant, Scope extends string>(
		this: void,
		scope: Scope,
		v: T,
	): ScopedVariant<T, Scope>;

	/**
	 * Create a **variant** from a list of elements. Each element may be a `string`
	 * or a `VariantCreator`.
	 * @param template A list of string literals or calls to `variation()`
	 * @returns a variant module.
	 *
	 * @tutorial
	 *
	 * The simplest use involves purely strings.
	 *
	 * ```ts
	 * const Suit = variant(['Spades', 'Hearts', 'Clubs', 'Diamonds']);
	 * ```
	 *
	 * It is possible to use `VariantCreator`s as well. Generate through `variation()`.
	 *
	 * ```ts
	 * const Shape = variant([
	 *     variation('circle', fields<{center: [number, number], radius: number}>()),
	 *     variation('rectangle', fields<{center: [number, number], length: number, width: number}>()),
	 * ]);
	 * ```
	 * Feel free to mix the approaches as necessary.
	 * ```ts
	 * const DebugAction = variant([
	 *     variation('LoadState', payload<RootState>()),
	 *     'ResetState',
	 *     'ToggleDebugMode',
	 * ]);
	 * ```
	 */
	variantList<T extends ValidListType>(
		this: void,
		template: T[],
	): Identity<VMFromVC<CreatorFromListType<T, K>>>;

	/**
	 * Create a **variant** from some template.
	 * @param template an object where each property represents a possible variation.
	 * The **key** is the string literal used as the type and the **value** is a function
	 * that handles the creation logic for that shape. This may be `{}` or `none` for an
	 * empty-bodied variant (`{type: 'someType'}`).
	 * @returns a variant module.
	 * @example
	 * ```ts
	 * const Action = variant({
	 *     AddTodo: fields<{message: string}>(),
	 *     Reload: {},
	 * });
	 *
	 * // Pair with `variation` to override the type returned by the creator function
	 * // while still using a friendly name. For example,
	 *
	 * const Action = variant({
	 *     AddTodo: variation('TODO:AddTodo', fields<{message: string}>()),
	 *     Reload: variation('TODO:Reload'),
	 * });
	 * ```
	 */
	variantModule<VM extends RawVariant>(
		this: void,
		template: VM,
	): Identity<VariantRecord<VM, K>>;

	/**
	 * Create a *generic* **variant** from some template. Use with `onTerms()`.
	 * @param template - a call to `onTerms` with some element.
	 *
	 * @tutorial
	 *
	 * To create the classic `Option<T>` type (a.k.a. `Maybe<T>`)
	 * ```ts
	 * const Option = variant(onTerms(({T}) => ({
	 *     Some: payload(T),
	 *     None: {},
	 * })));
	 * type Option<T, TType extends TypeNames<typeof Option> = undefined>
	 *     = GVariantOf<typeof Option, TType, {T: T}>;
	 * ```
	 * Note the use of `GVariantOf` instead of `VariantOf`.
	 */
	variant<VM extends RawVariant>(
		this: void,
		template: GenericTemplate<VM>,
	): Identity<GenericVariantRecord<VM, K>>;

	/**
	 * Create a **variant** from some template.
	 * @param template an object where each property represents a possible variation.
	 * The **key** is the string literal used as the type and the **value** is a function
	 * that handles the creation logic for that type.
	 * @returns a variant module.
	 * @example
	 * ```ts
	 * const Action = variant({
	 *     AddTodo: fields<{message: string}>(),
	 *     Reload: {},
	 * });
	 *
	 * // Pair with `variation` to override the type returned by the creator function
	 * // while still using a friendly name. For example,
	 *
	 * const Action = variant({
	 *     AddTodo: variation('TODO:AddTodo', fields<{message: string}>()),
	 *     Reload: variation('TODO:Reload'),
	 * });
	 * ```
	 */
	variant<VM extends RawVariant>(
		this: void,
		template: VM,
	): Identity<VariantRecord<VM, K>>;

	/**
	 * Create a **variant** from a list of elements. Each element may be a `string`
	 * or a `VariantCreator`.
	 * @param template A list of string literals or calls to `variation()`
	 * @returns a variant module.
	 *
	 * @tutorial
	 *
	 * The simplest use involves purely strings.
	 *
	 * ```ts
	 * const Suit = variant(['Spades', 'Hearts', 'Clubs', 'Diamonds']);
	 * ```
	 *
	 * It is possible to use `VariantCreator`s as well. Generate through `variation()`.
	 *
	 * ```ts
	 * const Shape = variant([
	 *     variation('circle', fields<{center: [number, number], radius: number}>()),
	 *     variation('rectangle', fields<{center: [number, number], length: number, width: number}>()),
	 * ]);
	 * ```
	 * Feel free to mix the approaches as necessary.
	 * ```ts
	 * const DebugAction = variant([
	 *     variation('LoadState', payload<RootState>()),
	 *     'ResetState',
	 *     'ToggleDebugMode',
	 * ]);
	 * ```
	 */
	variant<T extends ValidListType>(
		this: void,
		template: T[],
	): Identity<VMFromVC<CreatorFromListType<T, K>>>;

	/**
	 * Specify a variation of a variant. One variant will have many variations.
	 *
	 * @param type the string literal used as the distinguishing type.
	 * @param creator a function that acts as the body of the constructor.
	 * @returns a variation creator a.k.a. a tag construtor.
	 * @tutorial
	 * Use directly, use as an element of a list for a variant, *or* use to provide
	 * a more specific underlying type.
	 * 1. Use directly
	 *     ```ts
	 *     const snake = variation('snake', (name: string, pattern = 'string') => ({name, pattern}));
	 *     ```
	 * 1. In `variant` list
	 *     ```ts
	 *     const Animal = variant([
	 *         ...
	 *         variation('snake', (name: string, pattern = 'striped') => ({name, pattern}));
	 *     ]);
	 *     ```
	 * 1. In `variant` object
	 *     ```ts
	 *     const Animal = variant({
	 *         ...,
	 *         snake: variation('ANIMAL_SNAKE', (name: string, pattern = 'striped') => ({name, pattern})),
	 *     });
	 *     ```
	 */
	variation<T extends string, F extends Func = () => {}>(
		this: void,
		type: T,
		creator?: F,
	): VariantCreator<T, F extends VariantCreator<string, infer VF> ? VF : F, K>;
}

export function variantImpl<K extends string>(key: K): VariantFuncs<K> {
	function scope<T extends RawVariant, Scope extends string>(
		scope: Scope,
		v: T,
	): Identity<ScopedVariant<T, Scope>> {
		return keys(v).reduce(
			(acc, key) => {
				return {
					...acc,
					[key]: variation(
						scopeType(scope, key as string),
						typeIs(v[key], "function") ? (v[key] as any) : identityFunc,
					),
				};
			},
			{} as Identity<ScopedVariant<T, Scope>>,
		);
	}

	function descope<T extends Record<K, ScopedType<string, string>>>(obj: T) {
		return {
			...obj,
			[key]: descopeType(obj[key] as ScopedType<string, string>),
		} as any;
	}

	function variation<T extends string, F extends Func = () => {}>(
		t: T,
		creator?: F,
	) {
		const maker = {
			output: { key, type: t },
			name: t,
			[VARIANT_CREATOR_BRAND]: true,
			toString: () => t,
		};

		setmetatable(maker, {
			__call: ((_: typeof maker, ...args: unknown[]) => {
				const value = (creator ?? identityFunc)(...args);

				assert(typeIs(value, "table"));

				if ("then" in value && typeIs(value.then, "function")) {
					return (value as Promise<any>).then((result) => {
						assert(typeIs(result, "table"));

						if (key in result) {
							return result;
						} else {
							return assign(result, { [key]: t });
						}
					});
				} else if (key in value) {
					return value;
				}

				return assign(value, { [key]: t });
			}) as any,
		});

		return maker as unknown as VariantCreator<
			T,
			F extends VariantCreator<string, infer VF> ? VF : F,
			K
		>;
	}

	function variantModule<VM extends RawVariant>(
		template: VM,
	): Identity<VariantRecord<VM, K>> {
		return entries(template).reduce(
			(result, [vmKey, vmVal]) => {
				// whether to use the existing value (pass-through variations), or create a new variation.
				const creator = isVariantCreator(vmVal)
					? vmVal
					: typeIs(vmVal, "function")
						? variation(vmKey as string, vmVal)
						: variation(vmKey as string, identityFunc);

				return {
					...result,
					[vmKey]: creator,
				};
			},
			{} as Identity<VariantRecord<VM, K>>,
		);
	}

	function variantList<T extends ValidListType>(
		template: T[],
	): Identity<VMFromVC<CreatorFromListType<T, K>>> {
		return template
			.map((value) => {
				if (typeIs(value, "string")) {
					return variation(value);
				} else if (isVariantCreator(value)) {
					return value;
				}

				return value;
			})
			.reduce(
				(result, value) => {
					// TODO: investigate the purpose of double check
					let creator = (
						typeIs(value, "string") ? variation(value) : value
					) as VariantCreator<string, Func, K>;

					return {
						...result,
						[creator.output.type]: creator,
					};
				},
				{} as Identity<VMFromVC<CreatorFromListType<T, K>>>,
			);
	}

	function variant(template: {} | []) {
		if (isArray(template)) {
			return variantList(template as ValidListType[]);
		} else {
			return variantModule(template);
		}
	}

	return {
		descope,
		scoped: scope,
		variant,
		variantList,
		variantModule,
		variation,
	};
}
