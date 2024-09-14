import { it, expect } from "@rbxts/jest-globals";
import { catalog } from "./catalog";

export = () => {
	it("strEnum functionality", () => {
		const Suit = catalog(["Spades", "Hearts", "Clubs", "Diamonds"]);
		type Suit = keyof typeof Suit;

		expect((Suit as unknown as ReadonlyMap<unknown, unknown>).size()).toBe(4);
		expect("Spades" in Suit).toBe(true);
		expect("Hearts" in Suit).toBe(true);
		expect("Clubs" in Suit).toBe(true);
		expect("Diamonds" in Suit).toBe(true);
		expect(Suit.Spades).toBe("Spades");
	});

	it("strEnum (empty)", () => {
		const Item = catalog([]);
		type Item = keyof typeof Item;

		expect((Item as unknown as ReadonlyMap<unknown, unknown>).size()).toBe(0);
	});
};
