type Constructable = { new (...args: Array<any>): any };

type ConstructableToFactory<T extends Constructable> = T extends {
	new (...args: infer Args): infer Return;
}
	? (...args: Args) => Return
	: T;

/**
 * Create a variant based on a class.
 * @param cls class definition / constructor
 * @returns a variant creator that wraps the class constructor into a factory function.
 */
export function construct<T extends Constructable>(
	cls: T,
): ConstructableToFactory<T> {
	return ((...args: Array<unknown>) => {
		const instance = new cls(...args);

		return instance;
	}) as ConstructableToFactory<T>;
}
