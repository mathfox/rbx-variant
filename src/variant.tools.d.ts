/**
 * Describe the fields of the variation.
 *
 * When used creates a function of type `(input: T) => T & {type: 'literal'}`
 *
 * @param defaults set some default values for the object. Note this does *not* adjust the return type.
 */
export function fields<TInput extends Record<string, defined>>(): (
	...args: Record<string, never> extends TInput ? [input?: TInput] : [input: TInput]
) => TInput;

/**
 * Take a single variable of type T and store as 'payload'
 */
export function payload<TInput>(): () => { payload: TInput };

/**
 * Create an empty variation (`{type: 'literal'}`).
 */
export function none(): () => {};
