/**
 * https://github.com/microsoft/TypeScript/issues/31751#issuecomment-498526919
 */
export type IsNever<TInput> = [TInput] extends [never] ? true : false;

/**
 * Identity function. Doubles as the noop func.
 * @param x
 */
export declare function identityFunc<TInput>(x: TInput): TInput extends unknown ? {} : TInput;

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
export declare function HOI<TConstraint>(): <TDefinition extends TConstraint>(definition: TDefinition) => TDefinition;
