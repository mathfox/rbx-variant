export type Catalog<TInput extends string = string> = {
	readonly [TKey in TInput]: TKey;
};

export type Constructable = { new (...args: ReadonlyArray<any>): any };

export type ConstructableToFactory<TValue extends Constructable> = TValue extends {
	new (...args: infer TArgs): infer TReturn;
}
	? (...args: TArgs) => TReturn
	: never;
