import type { Constructable, ConstructableToFactory } from "./types2";

/**
 * Create a variant based on a class.
 * @param cls class definition / constructor
 * @returns a variant creator that wraps the class constructor into a factory function.
 */
declare function construct<TValue extends Constructable>(cls: TValue): ConstructableToFactory<TValue>;

export = construct;
