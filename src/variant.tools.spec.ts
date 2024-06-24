/// <reference types="@rbxts/testez/globals" />

import { equals } from "@rbxts/phantom/src/Array";
import { variation } from "./type";
import { fields } from "./variant.tools";

export = () => {
	it("fields empty", () => {
		const testV = variation("test", fields<{ test?: 5 }>());

		const emptyUse = testV();
		const emptyObjectUse = testV({});
		const validUse = testV({ test: 5 });

		expect(equals(emptyUse, { type: "test" })).to.equal(true);
		expect(equals(emptyObjectUse, { type: "test" })).to.equal(true);
		expect(equals(validUse, { type: "test", test: 5 })).to.equal(true);
	});
};
