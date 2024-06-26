/// <reference types="@rbxts/testez/globals" />

import { equals } from "@rbxts/phantom/src/Array";
import { Animal, CapsAnimal, sample } from "./__test__/animal";
import { variantCosmos } from "./cosmos";
import { constant, just, unload } from "./match.tools";
import type { TypeNames, VariantOf } from "./precepts";
import {
	lookup,
	match,
	ofLiteral,
	otherwise,
	partial,
	prematch,
	scoped,
	variant,
	withFallback,
} from "./type";
import { typeMap } from "./typeCatalog";
import { fields, payload } from "./variant.tools";

export = () => {
	it("match (basic)", () => {
		const rate = (animal: Animal) =>
			match(animal, {
				cat: (_) => _.furnitureDamaged,
				dog: (_) => 4,
				snake: just(5),
			});

		expect(rate(sample.cerberus)).to.equal(4);
		expect(rate(Animal.cat({ name: "Yellow", furnitureDamaged: 2 }))).to.equal(
			2,
		);
		expect(rate(Animal.snake("Paleos"))).to.equal(5);
	});

	it(`match (inline)`, () => {
		const animalList: Animal[] = [
			sample.cerberus,
			Animal.cat({ name: "Perseus", furnitureDamaged: 0 }),
			Animal.dog({ name: "Twix" }),
		];

		const renamed = animalList.map(
			match({
				cat: (_) => ({ ..._, name: `${_.name}-paw` }),
				dog: (_) => ({ ..._, name: `${_.name}-floof` }),
				snake: (_) => ({ ..._, name: `${_.name}-noodle` }),
			}),
		);

		expect(renamed[0].name).to.equal("Cerberus-floof");
		expect(renamed[1].name).to.equal("Perseus-paw");
		expect(renamed[2].name).to.equal("Twix-floof");
	});
	it(`match (inline partial)`, () => {
		const animalList: Animal[] = [
			sample.cerberus,
			Animal.cat({ name: "Perseus", furnitureDamaged: 0 }),
			Animal.dog({ name: "Twix" }),
			Animal.snake("Terra"),
		];

		const renamed = animalList.map(
			match(
				partial({
					cat: (_) => ({ ..._, name: `${_.name}-paw` }),
					dog: (_) => ({ ..._, name: `${_.name}-floof` }),
					default: (_) => ({ ..._, name: `${_.name}-animal` }),
				}),
			),
		);

		expect(renamed[0].name).to.equal("Cerberus-floof");
		expect(renamed[1].name).to.equal("Perseus-paw");
		expect(renamed[2].name).to.equal("Twix-floof");
		expect(renamed[3].name).to.equal("Terra-animal");
	});

	it("(m2 otherwise", () => {
		const rate = (a: Animal) =>
			match(
				a,
				otherwise(
					{
						dog: (d) => d.type,
					},
					(_) => {
						return 6;
					},
				),
			);
	});

	it("prematch on type", () => {
		const test = prematch<Animal>()({
			cat: (_) => 5,
			dog: (_) => 6,
			snake: (_) => 9,
		});

		prematch<Animal>()(
			partial({
				default: (_) => 5,
			}),
		);
		const result = test(sample.cerberus);

		expect(result).to.equal(6);
		expect(test(Animal.snake("Kailash"))).to.equal(9);
	});

	it("prematch on module", () => {
		const test = prematch(Animal)({
			cat: (_) => 5,
			dog: (_) => 6,
			snake: (_) => 8,
		});

		const result = test(sample.cerberus);

		expect(result).to.equal(6);
		expect(test(Animal.snake("Kailash"))).to.equal(8);
	});

	it("prematch on partial match", () => {
		const test = prematch(Animal)(
			partial({
				cat: (_) => 5,
				dog: (_) => 6,
				default: (_) => 8,
			}),
		);

		const result = test(sample.cerberus);

		expect(result).to.equal(6);
		expect(test(Animal.snake("Kailash"))).to.equal(8);
	});

	it("match (partial)", () => {
		const rate = (animal: Animal) =>
			match(
				animal,
				partial({
					cat: (_) => _.furnitureDamaged,
					default: (_) => 5,
				}),
			);

		expect(rate(Animal.cat({ name: "Yellow", furnitureDamaged: 2 }))).to.equal(
			2,
		);
		expect(rate(sample.cerberus)).to.equal(5);
	});

	it("caps animal", () => {
		const cat = CapsAnimal.cat({
			name: "Steve",
			furnitureDamaged: 0,
		}) as CapsAnimal;

		match(cat, {
			[CapsAnimal.cat.output.type]: just(5),
			[CapsAnimal.dog.output.type]: just(4),
			[CapsAnimal.snake.output.type]: just(4),
		});
	});

	it("caps animal, keymap (destructured)", () => {
		const catInstance = CapsAnimal.cat({
			name: "Steve",
			furnitureDamaged: 0,
		}) as CapsAnimal;

		const _ = typeMap(CapsAnimal);

		const result = match(catInstance, {
			[_.cat]: just(5),
			[_.dog]: just(4),
			[_.snake]: just(3),
		});

		expect(result).to.equal(5);
	});

	it("caps animal, keymap (destructured)", () => {
		const catInstance = CapsAnimal.cat({
			name: "Steve",
			furnitureDamaged: 0,
		}) as CapsAnimal;

		const { cat, dog, snake } = typeMap(CapsAnimal);

		const result = match(catInstance, {
			[cat]: just(5),
			[dog]: just(4),
			[snake]: just(3),
		});

		expect(result).to.equal(5);
	});

	it("scoped match", () => {
		const Animal2 = scoped("Animal", {
			Cat: fields<{ name: string }>(),
			Dog: fields<{ name: string; toy?: string }>(),
		});
		type Animal2<T extends TypeNames<typeof Animal2> = undefined> = VariantOf<
			typeof Animal2,
			T
		>;

		const cat = Animal2.Cat({ name: "Perseus" });

		const rating = (animal: Animal2) =>
			match(
				animal,
				partial({
					[Animal2.Cat.output.type]: (c) => c.name,
					default: just("yo"),
				}),
			);

		expect(rating(Animal2.Cat({ name: "steve" }))).to.equal("steve");
	});

	it("unload", () => {
		const thing = Test1.Alpha("yolo") as Test1;

		expect(test1Result(thing)).to.equal("yolo");
	});

	it("unload (solo)", () => {
		const thing = Test1.Alpha("yolo");

		const ret = match(thing, {
			Alpha: unload,
		});

		expect(ret).to.equal("yolo");
	});

	const Test1 = variant({
		Alpha: payload<string>(),
		Beta: fields<{ prop: string }>(),
		Gamma: {},
	});
	type Test1<T extends TypeNames<typeof Test1> = undefined> = VariantOf<
		typeof Test1,
		T
	>;

	const test1Result = (thing: Test1) =>
		match(thing, {
			Alpha: unload,
			Beta: ({ prop }) => prop,
			Gamma: just("gamma"),
		});

	it("just (solo)", () => {
		const thing = Test1.Alpha("yolo");

		const ret = match(thing, {
			Alpha: just(5),
		});

		expect(ret).to.equal(5);
	});

	it("just (complex)", () => {
		const result = test1Result(Test1.Gamma());

		expect(result).to.equal("gamma");
	});

	it("just (object)", () => {
		const result = (animal: Animal) =>
			match(
				animal,
				partial({
					snake: just({
						hello: "world",
						complex: 4,
					}),
					default: just(2),
				}),
			);

		expect(result(sample.cerberus)).to.equal(2);
		const resultObject = result(Animal.snake("Test"));
		expect(
			equals(resultObject as object, {
				hello: "world",
				complex: 4,
			}),
		).to.equal(true);
	});

	const wrapEnum = <T extends string | number>(a: T) => ofLiteral(a);

	it("onEnum basic", () => {
		enum Alpha {
			A = "A",
			B = "B",
		}

		expect(wrapEnum(Alpha.A).type).to.equal(Alpha.A);
		expect(wrapEnum(Alpha.B).type).to.equal(Alpha.B);
	});

	it("onEnum numeric", () => {
		enum Numba {
			A = 1,
			B = 2,
		}
		expect(wrapEnum(Numba.A).type).to.equal(Numba.A);
		expect(wrapEnum(Numba.B).type).to.equal(Numba.B);
	});

	it("match enum", () => {
		enum Alpha {
			A = "A",
			B = "B",
		}

		const rate = (a: Alpha) =>
			match(ofLiteral(a), {
				[Alpha.A]: constant(0),
				[Alpha.B]: constant(1),
			});

		expect(rate(Alpha.A)).to.equal(0);
		expect(rate(Alpha.B)).to.equal(1);
	});

	it("match enum (numeric)", () => {
		enum Alpha {
			A = "A",
			B = "B",
		}

		const rate = (a: Alpha) =>
			match(ofLiteral(a), {
				[Alpha.A]: constant(0),
				[Alpha.B]: constant(1),
			});

		expect(rate(Alpha.A)).to.equal(0);
		expect(rate(Alpha.B)).to.equal(1);
	});

	it("lookup rate", () => {
		const rate = (a: Animal) => {
			return match(
				a,
				lookup({
					cat: 1,
					dog: 2,
					snake: 3,
				}),
			);
		};

		expect(rate(sample.cerberus)).to.equal(2);
	});

	it("match literal (quiet)", () => {
		const rate = (a: Animal) => {
			const aKey = a.type;
			return match(aKey, {
				cat: () => 1,
				dog: () => 2,
				snake: () => 3,
			});
		};
		expect(rate(sample.cerberus)).to.equal(2);
	});

	it("match literal (lookup)", () => {
		const rate = (a: Animal) => {
			const aKey = a.type;
			return match(
				aKey,
				lookup({
					cat: 1,
					dog: 2,
					snake: 3,
				}),
			);
		};
		expect(rate(sample.cerberus)).to.equal(2);
	});

	it("inline match literal lookup", () => {
		const greeks = ["alpha", "beta", "gamma"] as const;

		const greekLetters = greeks.map(
			match(
				lookup({
					alpha: "A",
					beta: "B",
					gamma: "Γ",
				} as const),
			),
		);

		expect(greekLetters[0]).to.equal("A");
		expect(greekLetters[1]).to.equal("B");
		expect(greekLetters[2]).to.equal("Γ");
	});

	it("match promise inline", async () => {
		const animal = Promise.resolve(sample.cerberus as Animal);

		const result = await animal.then(
			match({
				cat: (c) => c.type,
				dog: (d) => d.name,
				snake: (s) => s.pattern,
			}),
		);

		expect(result).to.equal("Cerberus");
	});

	it("match withFallback", () => {
		const rating = (a: Animal) => {
			return match(
				a,
				withFallback(
					{
						cat: (_) => 1,
						dog: (_) => 2,
						snake: (_) => 3,
					},
					(_) => 0,
				),
			);
		};

		const fakeAnimal = { type: "toaster" } as unknown as Animal;

		expect(rating(Animal.dog({ name: "Blair" }))).to.equal(2);
		expect(rating(fakeAnimal)).to.equal(0);
	});

	it("match withFallback (undefined)", () => {
		const rating = (a: Animal) => {
			return match(
				a,
				withFallback(
					{
						cat: (_) => 1,
						dog: (_) => 2,
						snake: (_) => 3,
					},
					(_) => 0,
				),
			);
		};

		expect(rating(Animal.dog({ name: "Blair" }))).to.equal(2);
		expect(rating(undefined as any)).to.equal(0);
	});

	it("match (creator)", () => {
		const makeInstance = (creator: (typeof Animal)[Animal["type"]]) => {
			return match(creator, {
				cat: (c) => c({ name: "Snookums", furnitureDamaged: 10 }),
				dog: (d) => d({ name: "Fido" }),
				snake: (s) => s("Ssssid"),
			});
		};

		expect(makeInstance(Animal.cat).name).to.equal("Snookums");
		expect(makeInstance(Animal.dog).name).to.equal("Fido");
		expect(makeInstance(Animal.snake).name).to.equal("Ssssid");
	});

	it("match (tag creator)", () => {
		const { match: tagMatch, variant: tagVariant } = variantCosmos({
			key: "tag",
		});

		const TagAnimal = tagVariant({
			cat: fields<{
				name: string;
				furnitureDamaged: number;
			}>(),
			dog: fields<{
				name: string;
				favoriteBall?: string;
			}>(),
			snake: (name: string, pattern = "striped") => ({ name, pattern }),
		});

		const makeInstance = (
			creator: (typeof TagAnimal)[keyof typeof TagAnimal],
		) => {
			return tagMatch(creator, {
				cat: (c) => c({ name: "Snookums", furnitureDamaged: 10 }),
				dog: (d) => d({ name: "Fido" }),
				snake: (s) => s("Ssssid"),
			});
		};

		expect(makeInstance(TagAnimal.cat).name).to.equal("Snookums");
		expect(makeInstance(TagAnimal.dog).name).to.equal("Fido");
		expect(makeInstance(TagAnimal.snake).name).to.equal("Ssssid");
	});
};
