import { identityFunc } from "./util";
import { expect, it } from "@rbxts/jest-globals";

export = () => {
	it("identity func", () => {
		expect(identityFunc(4)).toBe(4);
		expect(identityFunc({})).toBe({});
		expect(identityFunc("str")).toBe("str");
	});
};
