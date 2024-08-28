/**
 * Describe the fields of the variation.
 *
 * When used creates a function of type `(input: T) => T & {type: 'literal'}`
 *
 * @param defaults set some default values for the object. Note this does *not* adjust the return type.
 */
export function fields<T extends Record<string, defined>>(): (
	...args: Record<string, never> extends T ? [input?: T] : [input: T]
) => T;

/**
 * Take a single variable of type T and store as 'payload'
 */
export function payload<T>(): () => { payload: T };

/**
 * Create an empty variation (`{type: 'literal'}`).
 */
export function none(): () => {};
