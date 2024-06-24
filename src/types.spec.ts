/// <reference types="@rbxts/testez/globals" />

import { values } from "@rbxts/phantom/src/Dictionary";
import { Animal, sample } from "./__test__/animal";
import { types } from "./type";

export = () => {
	it("types (on variant)", () => {
		const animalTypes = types(Animal);

		expect(animalTypes.size()).to.equal(3);
		expect(animalTypes.includes(Animal.cat.output.type)).to.equal(true);
		expect(animalTypes.includes(Animal.dog.output.type)).to.equal(true);
		expect(animalTypes.includes(Animal.snake.output.type)).to.equal(true);
	});

	it("types (on empty variant)", () => {
		const emptyTypes = types({});

		expect(emptyTypes.size()).to.equal(0);
	});

	it("types (on creator list)", () => {
		const animalTypes = types(values(Animal));

		expect(animalTypes.includes("cat")).to.equal(true);
		expect(animalTypes.includes("dog")).to.equal(true);
		expect(animalTypes.includes("snake")).to.equal(true);
		expect(animalTypes.size()).to.equal(3);
	});

	it("types func (on instance list)", () => {
		const dogAndCat = [
			sample.cerberus,
			Animal.cat({ name: "Zagreus", furnitureDamaged: 2 }),
		];
		const animalTypes = types(dogAndCat);

		expect(animalTypes.includes("cat")).to.equal(true);
		expect(animalTypes.includes("dog")).to.equal(true);
		expect(animalTypes.size()).to.equal(2);
	});
};
