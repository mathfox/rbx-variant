/// <reference types="@rbxts/testez/globals" />

import { construct } from "./construct";
import type { VariantOf } from "./precepts";
import { variant, variation } from "./type";

export = () => {
	it("variant w/ classes", () => {
		// Defined ahead of time to have in scope for instanceOf check.
		const Dog = class {
			constructor(private barkVolume: number) {}

			public bark() {
				// can access class members.
				const msg = this.barkVolume > 5 ? "BARK" : "bark";
			}
		};

		// I'm honestly not sure if this will work.
		const ClassyAnimal = variant({
			dog: construct(Dog),
			cat: construct(
				class {
					public furnitureDamaged = 0;
				},
			),
			snake: construct(
				class {
					constructor(
						private color: string,
						private isStriped = false,
					) {}
				},
			),
		});
		type ClassyAnimal = VariantOf<typeof ClassyAnimal>;

		const dog = ClassyAnimal.dog(4);

		expect(dog instanceof Dog).to.equal(true);
	});

	it("variant list w/ classes", () => {
		const ListedDog = variant([
			variation(
				"Dog",
				construct(
					class {
						public doesBark = true;
					},
				),
			),
		]);
		const dog = ListedDog.Dog();

		expect(dog.doesBark).to.equal(true);
	});
};
