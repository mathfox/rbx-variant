export type Catalog<TInput extends string = string> = {
	readonly [TKey in TInput]: TKey;
};

export type Constructable = { new (...args: ReadonlyArray<any>): any };

export type ConstructableToFactory<TValue extends Constructable> = TValue extends {
	new (...args: infer TArgs): infer TReturn;
}
	? (...args: TArgs) => TReturn
	: never;

/**
 * Collapse a complex type into a more easily read object.
 */
export type Identity<TValue> = TValue extends object
	? {} & {
			[TKey in keyof TValue]: TValue[TKey];
		}
	: TValue;

/**
 * Given an object or a promise containing an object, patch it to
 * include some extra properties.
 *
 * This is mostly used to merge the `{type: ______}` property into
 * the body definition of a variant.
 *
 * Note: Places items at the top of the resulting object - this helps clearly
 * identify the discriminant in a union.
 */
export type PatchObjectOrPromise<T extends {} | PromiseLike<{}>, U extends {}> = T extends PromiseLike<infer R>
	? Promise<Identity<U & R>>
	: Identity<U & T>;

/**
 * The type marking metadata.
 */
export interface Outputs<TKey, TType> {
	readonly output: {
		/**
		 * Discriminant property key
		 */
		readonly key: TKey;

		/**
		 * The type of object created by this function.
		 */
		readonly type: TType;
	};
}

/**
 * The constructor function for one tag of a variant type
 *
 * @template T literal string used as the type
 * @template F function serving as the variant definition
 * @template K the discriminant.
 */
export type VariantCreator<
	TName extends string,
	TCreator extends (...args: Array<any>) => {} = (...args: Array<any>) => {},
	TType extends string = "type",
> = ((...args: Parameters<TCreator>) => PatchObjectOrPromise<ReturnType<TCreator>, Record<TType, TName>>) &
	Outputs<TType, TName> & {
		name: TName;
	};

/**
 * A variant module definition. Literally an object serving as
 * a collection of variant constructors.
 */
export type VariantModule<TType extends string> = {
	[TName in string]: VariantCreator<TName, Callback, TType>;
};

/**
 * Extract a type string from either a string or `VariantCreator`
 */
export type TypeStr<
	T extends string | VariantCreator<string, Func, K>,
	K extends string = "type",
> = T extends VariantCreator<infer R, Func, K> ? R : T extends string ? T : never;
