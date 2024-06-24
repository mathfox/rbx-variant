/// <reference types="@rbxts/testez/globals" />

import { Animal, sample } from "./__test__/animal";
import { just } from "./match.tools";
import { isOfVariant, match, partial, variant } from "./type";

export = () => {
	it("isOfVariant", () => {
		const kitty = Animal.cat({ name: "Perseus", furnitureDamaged: 0 }) as {};

		let flag = false;
		if (isOfVariant(kitty, Animal)) {
			// should work because 'name' is available on all elements of the union Animal.
			const _name = kitty.name;
			flag = match(
				kitty,
				partial({
					cat: just(true),
					default: just(false),
				}),
			);
		}

		expect(flag).to.equal(true);
	});

	it("isOfVariant, dynamic set", () => {
		const kitty = Animal.cat({ name: "Perseus", furnitureDamaged: 0 }) as {};

		// just the furry animals.
		const flag = isOfVariant(kitty, variant([Animal.cat, Animal.dog]));

		expect(flag).to.equal(true);
	});

	it("isOfVariant, dynamic set", () => {
		const kitty = Animal.cat({ name: "Perseus", furnitureDamaged: 0 }) as {};

		// just the furry animals.
		const flag = isOfVariant(kitty, variant(["cat", "dog"]));

		// yes, this is all it ever checked.
		expect(flag).to.equal(true);
	});

	it("isOfVariant ({})", () => {
		expect(isOfVariant({}, Animal)).to.equal(false);
	});

	it("isOfVariant, curried", () => {
		const isAnimal = isOfVariant(Animal);

		expect(isAnimal(sample.cerberus)).to.equal(true);
		expect(isAnimal(sample.perseus)).to.equal(true);
		expect(isAnimal({})).to.equal(false);
	});

	it("isOfVariant, curried array", () => {
		const animals = [sample.cerberus, sample.perseus, sample.STEVE];
		const isAnimalList = animals.map(isOfVariant(Animal));

		expect(isAnimalList[0]).to.equal(true);
		expect(isAnimalList[1]).to.equal(true);
		expect(isAnimalList[2]).to.equal(false);
	});
};
