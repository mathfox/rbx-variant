/// <reference types="@rbxts/testez/globals" />

import { Animal, sample } from "./__test__/animal";
import { isType } from "./type";

export = () => {
	it("isType (curried)", () => {
		const isDog = isType("dog");
		expect(isDog(sample.cerberus)).to.equal(true);
	});
	it("isType (curried)", () => {
		const isDog = isType(Animal.dog);
		expect(isDog(sample.cerberus)).to.equal(true);
	});

	it("Animal filter", () => {
		const animals = [sample.cerberus, Animal.snake("Steve")];

		const result = animals.filter(isType(Animal.dog));
		expect(result.size()).to.equal(1);
		expect(result[0].name).to.equal("Cerberus");
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
			assert(kerb.type === "dog");
		}).to.never.throw();
	});
};
