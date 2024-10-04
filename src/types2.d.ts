export type Catalog<TInput extends string = string> = {
	readonly [TKey in TInput]: TKey;
};
