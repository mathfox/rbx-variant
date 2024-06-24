/// <reference types="@rbxts/testez/globals" />

import { equals, values } from "@rbxts/phantom/src/Dictionary";
import { catalog } from "./catalog";

export = () => {
	it("strEnum functionality", () => {
		const Suit = catalog(["Spades", "Hearts", "Clubs", "Diamonds"]);
		type Suit = keyof typeof Suit;

		expect(values(Suit).size()).to.equal(4);
		expect("Spades" in Suit).to.equal(true);
		expect("Hearts" in Suit).to.equal(true);
		expect("Clubs" in Suit).to.equal(true);
		expect("Diamonds" in Suit).to.equal(true);
		expect(Suit.Spades).to.equal("Spades");
	});

	it("strEnum (empty)", () => {
		const Item = catalog([]);
		type Item = keyof typeof Item;

		expect(equals(Item, {})).to.equal(true);
	});

	it("catalog - count items", () => {
		const Count = catalog(["One", "Two", "Three"], (_, i) => i + 1);

		expect(Count.One).to.equal(1);
		expect(Count.Two).to.equal(2);
		expect(Count.Three).to.equal(3);
	});

	it("capitalize", () => {
		// this isn't actually good, because each item is a union, but whatever.
		const primitive = catalog(
			["boolean", "number", "string"],
			(s) => s.upper() as Uppercase<typeof s>,
		);

		expect(primitive.boolean).to.equal("BOOLEAN");
		expect(primitive.number).to.equal("NUMBER");
	});

	it("catalog - object literal", () => {
		const Custom = catalog({
			name: "Steve",
			four: "Four",
		} as const);

		expect(Custom.four).to.equal("Four");
	});
};
