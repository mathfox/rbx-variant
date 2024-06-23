/// <reference types="@rbxts/testez/globals" />

import { constrained, just, TypeNames, variant, VariantOf } from ".";

export = () => {
	it("constrained (simple)", () => {
		const Test1 = variant(
			constrained((_x: string) => ({ min: 4 }), {
				Yo: (_x: string, min: number) => ({ min }),
			}),
		);
		type Test1<T extends TypeNames<typeof Test1> = undefined> = VariantOf<
			typeof Test1,
			T
		>;

		const instance = Test1.Yo("hello", 4);

		expect(instance.type).to.equal("Yo");
		expect(instance.min).to.equal(4);
	});

	it("constrained (hair example, optional properties)", () => {
		enum HairLength {
			Bald,
			Buzzed,
			Short,
			Medium,
			Long,
			BackLength,
		}

		const HairStyle = variant(
			constrained(just<{ min?: HairLength; max?: HairLength }>({}), {
				Bald: just({ max: HairLength.Bald }),
				Pixie: just({ min: HairLength.Short, max: HairLength.Medium }),
				Straight: just({ min: HairLength.Short }),
				Waves: just({ min: HairLength.Medium }),
			}),
		);
		type HairStyle<T extends TypeNames<typeof HairStyle> = undefined> =
			VariantOf<typeof HairStyle, T>;

		const baldie = HairStyle.Bald() as HairStyle;

		expect(baldie.max).to.equal(HairLength.Bald);
	});
};
