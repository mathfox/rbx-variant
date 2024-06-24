/// <reference types="@rbxts/testez/globals" />

import { equals } from "@rbxts/phantom/src/Array";
import { identityFunc, isPromise } from "./util";

export = () => {
	it("identity func", () => {
		expect(identityFunc(4)).to.equal(4);
		expect(equals(identityFunc({}), {})).to.equal(true);
		expect(identityFunc("str")).to.equal("str");
	});

	it("isPromise (positive)", () => {
		const test = Promise.resolve(4);

		expect(isPromise(test)).to.equal(true);
	});

	it("isPromise (negative)", () => {
		const test = {};

		expect(isPromise(test)).to.equal(false);
	});
};
