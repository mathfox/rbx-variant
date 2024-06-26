/// <reference types="@rbxts/testez/globals" />

import { Animal, sample } from "./__test__/animal";
import { just } from "./match.tools";
import { CompareResult } from "./remote";
import { remote, sequence } from "./type";

export = () => {
	const RemoteAnimal = remote(Animal);

	it("remote", () => {
		expect(RemoteAnimal.is.cat(sample.cerberus)).to.equal(false);
		expect(RemoteAnimal.is.dog(sample.cerberus)).to.equal(true);
	});

	it("remote is narrows", () => {
		const a = sample.cerberus as Animal;
		if (RemoteAnimal.is.cat(a)) {
			const result = a.furnitureDamaged;
			// this object doesn't have this type, but I can access it. Narrowing works.
			expect(result).to.equal(undefined);
		} else {
			const result = a.name;
			expect(result).to.equal("Cerberus");
		}
	});

	it("remote match", () => {
		const test = (animal: Animal) =>
			RemoteAnimal.match(animal, {
				cat: just(4),
				dog: just(5),
				snake: just("jo"),
			});

		const result = test(sample.cerberus);

		expect(result).to.equal(5);
	});

	const rank = sequence(Animal, ["dog", "cat", Animal.snake]);

	const perseus = rank.new.cat({ name: "Perseus", furnitureDamaged: 0 });

	it("order new obj", () => {
		expect(perseus.name).to.equal("Perseus");
		expect(perseus.furnitureDamaged).to.equal(0);
	});

	it("order compare", () => {
		expect(rank.compare(perseus, sample.cerberus)).to.equal(
			CompareResult.Greater,
		);
	});

	it("order compare", () => {
		expect(rank.compare(Animal.cat, sample.cerberus)).to.equal(
			CompareResult.Greater,
		);
	});

	it("order index", () => {
		expect(rank.index(sample.cerberus)).to.equal(0);
		expect(rank.index("cat")).to.equal(1);
		expect(rank.index(Animal.snake)).to.equal(2);
	});

	it("get", () => {
		expect(rank.get(0).output.type).to.equal("dog");
		expect(rank.types[0]).to.equal("dog");
	});
};
