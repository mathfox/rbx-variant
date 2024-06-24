/// <reference types="@rbxts/testez/globals" />

import { CapsAnimal } from "./__test__/animal";
import { typeCatalog, typeMap } from "./typeCatalog";

export = () => {
	it("typeCatalog", () => {
		const km = typeCatalog(CapsAnimal);

		expect(km.CAT).to.equal("CAT");
		expect(km.DOG).to.equal("DOG");
		expect(km.SNAKE).to.equal("SNAKE");
	});

	it("keymap match", () => {
		const km = typeMap(CapsAnimal);

		expect(km.cat).to.equal("CAT");
		expect(km.dog).to.equal("DOG");
		expect(km.snake).to.equal("SNAKE");
	});

	it("keymap object instance", () => {
		const cat = CapsAnimal.cat({
			name: "Steve",
			furnitureDamaged: 0,
		}) as CapsAnimal;
		const km = typeMap(CapsAnimal);

		expect(cat.type).to.equal(km.cat);
	});
};
