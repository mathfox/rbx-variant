/// <reference types="@rbxts/testez/globals" />

import { keys } from "@rbxts/phantom/src/Dictionary";
import {
	fields,
	payload,
	scoped,
	TypeNames,
	variant,
	VariantOf,
	variation,
} from ".";

export = () => {
	it("Simple module", () => {
		const Animal = variant({
			cat: fields<{ name: string; furnitureDamaged: number }>(),
			dog: fields<{ name: string; favoriteBall?: string }>(),
			snake: (name: string, patternName?: string) => ({
				name,
				pattern: patternName ?? "striped",
			}),
		});
		type Animal<T extends TypeNames<typeof Animal> = undefined> = VariantOf<
			typeof Animal,
			T
		>;

		expect(Animal.cat.output.type).to.equal("cat");
	});

	it("Renamed module", () => {
		const Animal = {
			cat: variation(
				"CAT",
				fields<{ name: string; furnitureDamaged: number }>(),
			),
			dog: variation("DOG", fields<{ name: string; favoriteBall?: string }>()),
			snake: variation("SNAKE", (name: string, patternName?: string) => ({
				name,
				pattern: patternName ?? "striped",
			})),
		};
		type Animal<T extends TypeNames<typeof Animal> = undefined> = VariantOf<
			typeof Animal,
			T
		>;

		expect(Animal.cat.output.type).to.equal("CAT");
	});

	it("variant with variations", () => {
		const Animal = variant({
			cat: variation(
				"CAT",
				fields<{ name: string; furnitureDamaged: number }>(),
			),
			dog: variation("DOG", fields<{ name: string; favoriteBall?: string }>()),
			snake: variation("SNAKE", (name: string, patternName?: string) => ({
				name,
				pattern: patternName ?? "striped",
			})),
		});
		type Animal<T extends TypeNames<typeof Animal> = undefined> = VariantOf<
			typeof Animal,
			T
		>;

		const snek = Animal.snake("Steve");
		expect(Animal.cat.output.type).to.equal("CAT");
		expect(snek.name).to.equal("Steve");
	});

	it("variant with variations", () => {
		const Animal = variant({
			cat: fields<{ name: string; furnitureDamaged: number }>(),
			dog: variation("DOG", fields<{ name: string; favoriteBall?: string }>()),
			snake: (name: string, patternName?: string) => ({
				name,
				pattern: patternName ?? "striped",
			}),
		});
		type Animal<T extends TypeNames<typeof Animal> = undefined> = VariantOf<
			typeof Animal,
			T
		>;

		const snek = Animal.snake("Steve");
		expect(Animal.cat.output.type).to.equal("cat");
		expect(Animal.dog.output.type).to.equal("DOG");
		expect(snek.name).to.equal("Steve");
	});

	it("method-style variant", () => {
		const Animal = variant({
			cat(name: string) {
				return {
					name,
					furnitureBroken: 0,
				};
			},
			dog(name: string) {
				return {
					name,
					favoriteBall: "black",
				};
			},
			snake(name: string, pattern = "striped") {
				return {
					name,
					pattern,
				};
			},
		});
		type Animal<T extends TypeNames<typeof Animal> = undefined> = VariantOf<
			typeof Animal,
			T
		>;

		const cerberus = Animal.dog("cerberus");

		expect(cerberus.name).to.equal("cerberus");
		expect(cerberus.favoriteBall).to.equal("black");
	});

	it("better variantList", () => {
		const Animal = variant([
			variation("dog", fields<{ name: string }>()),
			"bird",
		]);

		expect(Animal.bird().type).to.equal("bird");
	});

	it("card variantList", () => {
		const Suit = variant(["Diamonds", "Hearts", "Spades", "Clubs"]);

		expect(Suit.Clubs().type).to.equal("Clubs");
		expect(keys(Suit).size()).to.equal(4);
	});

	it("scoped", () => {
		const Animal2 = variant(
			scoped("Animal", {
				Cat: fields<{ name: string }>(),
				Dog: fields<{ name: string; toy?: string }>(),
			}),
		);
		type Animal2<T extends TypeNames<typeof Animal2> = undefined> = VariantOf<
			typeof Animal2,
			T
		>;

		const cat = Animal2.Cat({ name: "Perseus" });

		expect(cat.name).to.equal("Perseus");
		expect(cat.type).to.equal("Animal/Cat");
	});

	it("variation w/ override", () => {
		const resultF = variation("one", () => ({ type: "two" }));

		const result = resultF();

		// TODO: This is intentional, but the type is wrong. Either change the intention
		// of the design or change the type to consider the function passed in.
		expect(result.type).to.equal("two");
	});

	it("variant from enum", () => {
		enum AniType {
			d = "dog",
			c = "cat",
			s = "snake",
		}

		const Animal = variant({
			[AniType.d]: payload<"woof">(),
			[AniType.c]: payload<"meow">(),
			[AniType.s]: payload<"hiss">(),
		});
		type Animal = VariantOf<typeof Animal>;
	});

	it("variant retains mismatched names", () => {
		const Animal2 = scoped("Animal", {
			Cat: fields<{ name: string }>(),
			Dog: fields<{ name: string; toy?: string }>(),
		});
		type Animal2<T extends TypeNames<typeof Animal2> = undefined> = VariantOf<
			typeof Animal2,
			T
		>;

		const Animal3 = variant(Animal2);

		expect(Animal3.Cat).to.be.ok();
		expect(Animal3.Cat.output.type).to.equal("Animal/Cat");
		expect(Animal3.Dog.output.type).to.equal("Animal/Dog");
	});
};
