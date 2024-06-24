/// <reference types="@rbxts/testez/globals" />

import { variantCosmos } from "./cosmos";
import type { Matrix } from "./flags";
import { constant } from "./match.tools";
import type { GetTypeLabel, TypeNames, VariantOf } from "./precepts";
import { fields, payload } from "./variant.tools";

export = () => {
	const {
		isType,
		match,
		otherwise,
		ofLiteral,
		partial,
		variantList,
		variation,
		variant,
	} = variantCosmos({ key: "tag" });

	const Animal = variant({
		cat: fields<{
			name: string;
			furnitureDamaged: number;
		}>(),
		dog: fields<{
			name: string;
			favoriteBall?: string;
		}>(),
		snake: (name: string, pattern = "striped") => ({
			name,
			pattern,
		}),
	});
	type Animal<T extends TypeNames<typeof Animal> = undefined> = VariantOf<
		typeof Animal,
		T
	>;

	it("", () => {
		const thing = variant({
			cat: {},
		});
		const thing2 = variant(["reddit", variation("yoho", payload<number>())]);
	});
	it("IsType 0", () => {
		const kitty = Animal.cat({ name: "Yannis", furnitureDamaged: 0 }) as Animal;

		const isCat = isType(kitty, "cat");
		const isDog = isType(kitty, "dog");
		expect(isCat).to.equal(true);
		expect(isDog).to.equal(false);
	});

	it("IsType UDTG", () => {
		const kerb = Animal.dog({ name: "Kerberos", favoriteBall: "yellow" });

		expect(() => {
			assert(isType(kerb, "dog"), "isType did not register kerb as a dog");
			assert(kerb.favoriteBall === "yellow");
		}).to.never.throw();
	});

	it("IsType UDTG (func)", () => {
		const kerb = Animal.dog({ name: "Kerberos", favoriteBall: "yellow" });

		expect(() => {
			assert(isType(kerb, Animal.dog), "isType did not register kerb as a dog");
			assert(kerb.favoriteBall === "yellow");
		}).to.never.throw();
	});

	it("IsType UDTG wrong", () => {
		const kerb = Animal.dog({
			name: "Kerberos",
			favoriteBall: "yellow",
		}) as Animal;

		expect(() => {
			assert(
				!isType(kerb, Animal.snake),
				"isType did not register kerb as a dog",
			);
			assert(kerb.tag === "dog");
		}).to.never.throw();
	});

	function id<T>(x: T): T {
		return x;
	}

	it("match", () => {
		const kerb = Animal.dog({
			name: "Kerberos",
			favoriteBall: "yellow",
		}) as Animal;
	});

	it("match 2", () => {
		const kerb = Animal.dog({
			name: "Kerberos",
			favoriteBall: "yellow",
		}) as Animal;

		const kt = kerb.tag;

		const thing = match(
			kerb,
			otherwise(
				{
					cat: ({ name, furnitureDamaged }) => {
						return name + furnitureDamaged;
					},
					dog() {
						return undefined;
					},
				},
				(_) => {
					return 5;
				},
			),
		);

		const otherTest = match(
			ofLiteral(kerb.tag),
			partial({
				cat: ({ tag }) => tag,
				default: constant(6),
			}),
		);
	});

	it("", () => {
		type ajfak = GetTypeLabel<typeof Animal, "dog">;
		type asdf = ajfak[keyof ajfak];

		type Animatrix = Matrix<typeof Animal>;
	});

	it("documentation test", () => {
		const { variant } = variantCosmos({ key: "tag" });

		const Test = variant({
			/**
			 * T-One
			 */
			One: {},
			/**
			 * Tea-2
			 */
			Two: /**
        test
        */ fields</**A*/ {
				/**
				 * Test
				 */
				a: number;
			}>(),
		});
		type Test<T extends TypeNames<typeof Test> = undefined> = VariantOf<
			typeof Test,
			T
		>;

		Test.One();
		Test.Two({ a: 5 });

		type typenames = TypeNames<typeof Test>;
		type sheisa = Test<"Two">;
	});

	it("variant list", () => {
		const Ani = variantList([
			"a",
			variation("b", () => ({ timestamp: DateTime.now() })),
		]);
		type Ani<T extends TypeNames<typeof Ani> = undefined> = VariantOf<
			typeof Ani,
			T
		>;

		const thing = Ani.a();
		const thing2 = Ani.b();

		expect(thing2.timestamp.UnixTimestampMillis > 0).to.equal(true);
	});
};
