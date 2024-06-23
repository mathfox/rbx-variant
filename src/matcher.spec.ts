/// <reference types="@rbxts/testez/globals" />

import { match, matcher, ofLiteral, types } from "./type";
import { constant } from "./match.tools";
import { Animal, sample } from "./__test__/animal";
import { equals } from "@rbxts/phantom/src/Dictionary";

export = () => {
	it("matcher creation", () => {
		const m = matcher(sample.cerberus as Animal);

		expect(m).to.be.ok();
		expect(equals(m.target, sample.cerberus)).to.equal(true);
		expect(m.key).to.equal("type");
		expect(equals(m.handler, {})).to.equal(true);
	});

	it("matcher exhaust", () => {
		const rating = (animal: Animal) =>
			matcher(animal).exhaust({
				cat: (_) => 1,
				dog: (_) => 2,
				snake: (_) => 3,
			});

		expect(rating(sample.cerberus)).to.equal(2);
		expect(rating(sample.perseus)).to.equal(1);
	});

	it("matcher exhaust", () => {
		const rating = (animal: Animal) =>
			matcher(animal)
				.when("cat", (_) => 1)
				.exhaust({
					dog: (_) => 2,
					snake: (_) => 3,
				});

		expect(rating(sample.cerberus)).to.equal(2);
		expect(rating(sample.perseus)).to.equal(1);
	});

	it("matcher register", () => {
		const rating = (animal: Animal) =>
			matcher(animal)
				.register({
					cat: 4,
				})
				.execute();

		expect(rating(sample.perseus)).to.equal(4);
		expect(rating(sample.cerberus)).to.be.ok();
	});

	it("matcher register repeating", () => {
		const rating = (animal: Animal) =>
			matcher(animal)
				.register({
					cat: "kitty",
				})
				.register({
					dog: "puppy",
					snake: "snek",
				})
				.complete();
	});

	it("matcher lookup remaining", () => {
		const rating = (animal: Animal) =>
			matcher(animal)
				.register({
					cat: "kitty",
				})
				.lookup({
					dog: "puppy",
					snake: "snek",
				});
	});

	it("matcher lookupTable", () => {
		const rating = (animal: Animal) =>
			matcher(animal).lookup({
				cat: 1,
				dog: 2,
				snake: 3,
			});

		expect(rating(sample.cerberus)).to.equal(2);
	});

	it("matcher (layered)", () => {
		const rating = (a: Animal) => {
			const matcherThunk = () =>
				matcher(a).exhaust({
					cat: (c) => c.furnitureDamaged,
					dog: (d) => d.favoriteBall,
					snake: (s) => s.pattern,
				});
			return matcher(a)
				.register({
					cat: 4,
				})
				.else(matcherThunk);
		};

		expect(rating(sample.perseus)).to.equal(4);
		expect(rating(sample.cerberus)).to.be.ok();
	});

	it("matcher (simple when)", () => {
		const getName = (a: Animal) =>
			matcher(a)
				.when(["cat", "dog", "snake"], (_) => _.name)
				.complete();

		expect(getName(sample.cerberus)).to.equal("Cerberus");
		expect(getName(sample.perseus)).to.equal("Perseus");
	});

	it("matcher (simple when using types())", () => {
		const getName = (a: Animal) =>
			matcher(a)
				.when(types(Animal), (_) => _.name)
				.complete();

		expect(getName(sample.cerberus)).to.equal("Cerberus");
		expect(getName(sample.perseus)).to.equal("Perseus");
	});

	it("matcher (simple with creators)", () => {
		const getName = (a: Animal) =>
			matcher(a)
				.when([Animal.cat, Animal.dog], (_) => _.name)
				.when(["snake"], (s) => s.pattern)
				.complete();

		expect(getName(sample.cerberus)).to.equal("Cerberus");
		expect(getName(sample.perseus)).to.equal("Perseus");
		expect(getName(Animal.snake("Tanya", "spotted"))).to.equal("spotted");
	});

	it("matcher-else (simple with creators)", () => {
		const getName = (a: Animal) =>
			matcher(a)
				.when([Animal.cat, Animal.dog], (_) => _.name)
				.else((s) => s.pattern);

		expect(getName(sample.cerberus)).to.equal("Cerberus");
		expect(getName(sample.perseus)).to.equal("Perseus");
		expect(getName(Animal.snake("Tanya", "spotted"))).to.equal("spotted");
	});

	it("matcher (simple single-entry when)", () => {
		const getName = (a: Animal) =>
			matcher(a)
				.when([Animal.cat, Animal.dog], (_) => _.name)
				.when("snake", (s) => s.pattern)
				.complete();

		expect(getName(sample.cerberus)).to.equal("Cerberus");
		expect(getName(sample.perseus)).to.equal("Perseus");
		expect(getName(Animal.snake("Tanya", "spotted"))).to.equal("spotted");
	});

	it("matcher (when-complete)", () => {
		const getFeature = (a: Animal) =>
			matcher(a)
				.with({
					cat: (c) => c.furnitureDamaged,
					[Animal.dog.output.type]: (d) => d.favoriteBall,
					snake: (s) => s.pattern,
				})
				.complete();

		expect(getFeature(sample.cerberus)).never.to.be.ok();
		expect(getFeature(sample.perseus)).to.equal(0);
		expect(getFeature(Animal.snake("Tanya", "spotted"))).to.equal("spotted");
	});

	it("matcher (repeated withs)", () => {
		const getFeature = (a: Animal) =>
			matcher(a)
				.with({ cat: (c) => c.furnitureDamaged })
				.with({
					dog: (d) => d.favoriteBall,
					snake: (s) => s.pattern,
				})
				.complete();

		expect(getFeature(sample.cerberus)).never.to.be.ok();
		expect(getFeature(sample.perseus)).to.equal(0);
		expect(getFeature(Animal.snake("Tanya", "spotted"))).to.equal("spotted");
	});

	it("matcher (ofLiteral)", () => {
		const rate = (t: Animal["type"]) =>
			matcher(ofLiteral(t)).lookup({
				cat: 1,
				dog: 2,
				snake: 3,
			});

		expect(rate(Animal.cat.output.type)).to.equal(1);
		expect(rate(Animal.dog.output.type)).to.equal(2);
	});

	it("matcher failure", () => {
		expect(() => {
			const greetAnimal = (animal: Animal) => {
				(
					matcher(animal).when("snake", ({ name }) => `Hello ${name}`)  as unknown as {
                        complete: Callback
                    }
				).complete();
			};
		}).to.throw();
	});

	it("match enum", () => {
		enum Alpha {
			A = "A",
			B = "B",
		}

		const rate = (a: Alpha) =>
			match(ofLiteral(a), {
				[Alpha.A]: (_) => 0,
				[Alpha.B]: constant(1),
			});

		expect(rate(Alpha.A)).to.equal(0);
		expect(rate(Alpha.B)).to.equal(1);
	});

	it("matcher (of literal directly)", () => {
		const rate = (t: Animal["type"]) =>
			matcher(t).lookup({
				cat: 1,
				dog: 2,
				snake: 3,
			});

		expect(rate(Animal.cat.output.type)).to.equal(1);
		expect(rate(Animal.dog.output.type)).to.equal(2);
	});

	it("match enum directly", () => {
		enum Alpha {
			A = "A",
			B = "B",
		}

		const rate = (a: Alpha) =>
			matcher(a)
				.when(Alpha.A, (_) => 0)
				.when(Alpha.B, (_) => 1)
				.complete();

		expect(rate(Alpha.A)).to.equal(0);
		expect(rate(Alpha.B)).to.equal(1);
	});

	it("matcher greeks", () => {
		const greeks = ["alpha", "beta", "gamma"] as const;

		const greekLetters = greeks.map((letter) =>
			matcher(letter)
				.register({
					alpha: "A",
					beta: "B",
					gamma: "Γ",
				} as const)
				.complete(),
		);

		expect(greekLetters[0]).to.equal("A");
		expect(greekLetters[1]).to.equal("B");
		expect(greekLetters[2]).to.equal("Γ");
	});

	it("matcher lookup", () => {
		const greeks = ["alpha", "beta", "gamma"] as const;

		const greekLetters = greeks.map((letter) =>
			matcher(letter)
				.with({
					alpha: (_) => "A",
					beta: (_) => "B",
					gamma: (_) => "Γ",
				})
				.complete(),
		);

		expect(greekLetters[0]).to.equal("A");
		expect(greekLetters[1]).to.equal("B");
		expect(greekLetters[2]).to.equal("Γ");
	});

	it("matcher with fallback", () => {
		const rating = (a: Animal) =>
			matcher(a)
				.with({
					cat: (_) => 1,
					dog: (_) => 2,
					snake: (_) => 3,
				})
				.complete({
					withFallback: (_) => 0,
				});

		expect(rating(Animal.dog({ name: "Buffy" }))).to.equal(2);
		expect(rating({ type: "none" } as any)).to.equal(0);
	});

	it("matcher remaining", () => {
		const rating = (a: Animal) =>
			matcher(a)
				.when("cat", (_) => 1)
				.remaining({
					dog: (_) => 2,
					snake: (_) => 3,
				})
				.complete();

		expect(rating(sample.cerberus)).to.equal(2);
		expect(rating(undefined as any)).never.to.be.ok();
	});

	it("matcher remaining withFallback", () => {
		const rating = (a: Animal) =>
			matcher(a)
				.when("cat", (_) => 1)
				.remaining({
					dog: (_) => 2,
					snake: (_) => 3,
				})
				.complete({
					withFallback: (_) => 0,
				});

		expect(rating(sample.cerberus)).to.equal(2);
		expect(rating(undefined as any)).to.equal(0);
	});
};
