/// <reference types="@rbxts/testez/globals" />

import { pass, variant, Variant, typed, TypeNames, VariantOf, match } from ".";
import { Animal } from "./__test__/animal";

export = () => {
	it("typed (basic)", () => {
		type Option = Variant<"Some", { payload: any }> | Variant<"None">;
		const Option = variant(
			typed<Option>({
				Some: pass,
				None: pass,
			}),
		);

		const four = Option.Some({ payload: 4 });
		const none = Option.None();

		expect(four.payload).to.equal(4);
		expect(none.type).to.equal("None");
	});

	it("typed (basic)", () => {
		type Option = Variant<"Some", { payload: any }> | Variant<"None">;
		const Option = variant(
			typed<Option>((_) => ({
				Some: _,
				None: _,
			})),
		);

		const four = Option.Some({ payload: 4 });
		const none = Option.None();

		expect(four.payload).to.equal(4);
		expect(none.type).to.equal("None");
	});

	it("variantModuleTyped match", () => {
		const AnimClone = variant(
			typed<Animal>({
				dog: pass,
				cat: pass,
				snake: pass,
			}),
		);
		type AnimClone<T extends TypeNames<typeof AnimClone> = undefined> =
			VariantOf<typeof AnimClone, T>;

		const dog = AnimClone.dog({ name: "Twix" });

		const getName = (a: AnimClone) =>
			match(a, {
				cat: (c) => c.name,
				dog: (d) => d.name,
				snake: (s) => s.name,
			});
		const betterGetName = (a: AnimClone) => a.name;

		expect(dog.name).to.equal("Twix");
		expect(dog.favoriteBall).to.equal(undefined);

		expect(getName(dog)).to.equal("Twix");
		expect(betterGetName(dog)).to.equal("Twix");
	});
};
