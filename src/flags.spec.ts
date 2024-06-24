/// <reference types="@rbxts/testez/globals" />

import { values } from "@rbxts/phantom/src/Dictionary";
import { Animal, sample } from "./__test__/animal";
import { catalog } from "./catalog";
import { flags, ofLiteral } from "./type";

export = () => {
	it("flags (basic)", () => {
		const housePets = flags([
			sample.cerberus,
			Animal.cat({ name: "Perseus", furnitureDamaged: 0 }),
		]);

		expect(housePets.cat.name).to.equal("Perseus");
		expect(housePets.dog.favoriteBall).never.to.be.ok();
	});

	it("flags on catalog", () => {
		const Element = catalog(["fire", "air", "water", "earth"]);
		type Element = keyof typeof Element;

		// that's... interesting that this works. I'm not exactly sure what I'd use it for.
		// but still, neat.
		const elementMap = flags(values(Element).map(ofLiteral));
	});
};
