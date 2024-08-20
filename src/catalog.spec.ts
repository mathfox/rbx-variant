/// <reference types="@rbxts/testez/globals" />

import { catalog } from "./catalog";

export = () => {
	it("strEnum functionality", () => {
		const Suit = catalog(["Spades", "Hearts", "Clubs", "Diamonds"]);
		type Suit = keyof typeof Suit;

		expect((Suit as unknown as ReadonlyMap<unknown, unknown>).size()).to.equal(4);
		expect("Spades" in Suit).to.equal(true);
		expect("Hearts" in Suit).to.equal(true);
		expect("Clubs" in Suit).to.equal(true);
		expect("Diamonds" in Suit).to.equal(true);
		expect(Suit.Spades).to.equal("Spades");
	});

	it("strEnum (empty)", () => {
		const Item = catalog([]);
		type Item = keyof typeof Item;

		expect((Item as unknown as ReadonlyMap<unknown, unknown>).size()).to.equal(0);
	});
};
