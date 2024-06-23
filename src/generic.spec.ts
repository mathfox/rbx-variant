/// <reference types="@rbxts/testez/globals" />

import { equals } from "@rbxts/phantom/src/Dictionary";
import { Generify, Alpha, onTerms, GVariantOf } from "./generic";
import { just, match, TypeNames, Variant, variant } from "./index";
import { fields, payload } from "./variant.tools";

export = () => {
	it("generic (Option<T>)", () => {
		const Option = variant(
			onTerms(({ T }) => ({
				Some: payload(T),
				None: {},
			})),
		);
		type test = typeof Option;
		type Option<
			T,
			TType extends TypeNames<typeof Option> = undefined,
		> = GVariantOf<typeof Option, TType, { T: T }>;

		const num = Option.Some(4);
		const name = Option.Some("Steve");
		const none = Option.None();

		function extract<T>(opt: Option<T>) {
			return match(opt, {
				None: just(undefined),
				Some: ({ payload }) => payload,
			});
		}

		expect(num.payload).to.equal(4);
		expect(name.payload).to.equal("Steve");
		expect(equals(none, { type: "None" })).to.equal(true);

		expect(extract(num)).to.equal(4);
		expect(extract(name)).to.equal("Steve");
		expect(extract(none)).never.to.be.ok();
	});

	it("generic (Tree<T>)", () => {
		const Tree = variant(
			onTerms(({ T }) => {
				type Tree<T> =
					| Variant<"Branch", { payload: T; left: Tree<T>; right: Tree<T> }>
					| Variant<"Leaf", { payload: T }>;
				return {
					Branch: fields<{
						left: Tree<typeof T>;
						right: Tree<typeof T>;
						payload: typeof T;
					}>(),
					Leaf: payload(T),
				};
			}),
		);
		type Tree<T, TType extends TypeNames<typeof Tree> = undefined> = GVariantOf<
			typeof Tree,
			TType,
			{ T: T }
		>;

		const binTree = Tree.Branch({
			payload: 1,
			left: Tree.Branch({
				payload: 2,
				left: Tree.Leaf(4),
				right: Tree.Leaf(5),
			}),
			right: Tree.Leaf(3),
		});

		function depthFirst<T>(node: Tree<T>): T[] {
			type thing = Tree<T>;
			return match(node, {
				Leaf: ({ payload }) => [payload],
				Branch: ({ payload, left, right }) => {
					return [payload, ...depthFirst(left), ...depthFirst(right)];
				},
			});
		}

		const [d1, d2, d3, d4, d5] = depthFirst(binTree);
		expect(d1).to.equal(1);
		expect(d2).to.equal(2);
		expect(d3).to.equal(4);
		expect(d4).to.equal(5);
		expect(d5).to.equal(3);
	});
	// TODO: Integrate a type testing library.

	it("Generify 1", () => {
		type T = Alpha["A"];

		const _ = { nonce: 5 };
		type _ = typeof _;
		type RESULT = Generify<T, { A: _ }>;

		type EXPECT = RESULT extends _ ? true : false;
	});

	it("Generify (array)", () => {
		type T = [string, number, Alpha["A"]];

		const _ = { nonce: 5 } as const;
		type _ = typeof _;
		type RESULT = Generify<T, { A: _ }>;

		type EXPECT = RESULT extends [string, number, _] ? true : false;
	});

	it("Generify (function)", () => {
		type T = (input: Alpha["A"]) => typeof input;

		const _ = { nonce: 5 } as const;
		type _ = typeof _;
		type RESULT = Generify<T, { A: _ }>;

		type EXPECT = RESULT extends (input: _) => _ ? true : false;
	});

	it("Generify (higher order function)", () => {
		type T = (func: (input: Alpha["A"]) => typeof input) => true;

		const _ = { nonce: 5 } as const;
		type _ = typeof _;
		type RESULT = Generify<T, { A: _ }>;

		type EXPECT = RESULT extends (func: (input: _) => _) => true ? true : false;
	});

	it("Generify (github #13)", () => {
		type T = (payload: (input: Alpha["A"]) => boolean) => {
			payload: typeof payload;
		};

		const _ = { nonce: 5 } as const;
		type _ = typeof _;
		type RESULT = Generify<T, { A: _ }>;

		type EXPECT = RESULT extends (payload: (input: _) => boolean) => {
			payload: typeof payload;
		}
			? true
			: false;
	});
};
