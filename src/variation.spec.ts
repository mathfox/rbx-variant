/// <reference types="@rbxts/testez/globals" />

import { keys } from "@rbxts/phantom/src/Dictionary";
import { isVariantCreator, variantImpl } from "./variant";
import { payload, fields } from "./variant.tools";
import { Identity } from "./util";

export = () => {
	const str = {
		discriminant: "type",
		kerberos: "kerberos",
	} as const;
	const DISCRIMINANT = "type";
	const { variation, descope } = variantImpl(DISCRIMINANT);

	/**
	 * Begin tests.
	 */

	it("variation (string only)", () => {
		const dog = variation("dog");

		const kerberos = dog();

		expect(kerberos.type).to.equal("dog");
		expect(keys(kerberos).size()).to.equal(1);
	});

	it("variation (custom func, 0 param)", () => {
		const dog = variation("dog", () => ({ name: str.kerberos }));

		const kerberos = dog();

		expect(kerberos.type).to.equal("dog");
		expect(kerberos.name).to.equal(str.kerberos);
	});

	it("variation (custom func, 1 param)", () => {
		const dog = variation("dog", (name: string) => ({ name }));

		const kerberos = dog("kerberos");

		expect(kerberos).to.be.ok();
		expect(kerberos.type).to.equal("dog");
		expect(kerberos.name).to.equal("kerberos");
	});

	it("variation (payload)", () => {
		const dog = variation("dog", payload<string>());
		const kerberos = dog("kerberos");

		expect(kerberos).to.be.ok();
		expect(kerberos.type).to.equal("dog");
		expect(kerberos.payload).to.equal("kerberos");
	});

	it("variation (fields)", () => {
		const dog = variation(
			"dog",
			fields<{
				name: string;
				favoriteBall?: string;
			}>(),
		);

		const kerberos = dog({
			name: "kerberos",
			favoriteBall: "yellow",
		});
		expect(kerberos.name).to.equal("kerberos");
		expect(kerberos.favoriteBall).to.equal("yellow");
	});

	it("variation (fields, empty)", () => {
		const dog = variation("dog", fields());

		const kerberos = dog();

		expect(kerberos.type).to.equal("dog");
		expect(keys(kerberos).size()).to.equal(1);
	});

	it("variation .toString()", () => {
		const yoc = variation("yo");

		expect("" + yoc).to.equal("yo");
		expect(yoc.toString()).to.equal("yo");
	});

	it("variation .name", () => {
		const yoc = variation("yo");

		expect(yoc.name).to.equal("yo");
	});

	it("variation outputs", () => {
		const yoc = variation("yo");

		expect(yoc.output.key).to.equal(DISCRIMINANT);
		expect(yoc.output.type).to.equal("yo");
	});

	it("isVariantCreator", () => {
		const dog = variation("dog");

		expect(isVariantCreator(dog)).to.equal(true);
	});

	it("isVariantCreator", () => {
		const dog = () => ({ type: "dog" }) as const;

		expect(isVariantCreator(dog)).to.equal(false);
	});

	it("cyclical variation", () => {
		const one = variation("one");
		const two = variation("two", one);

		const first = one();
		const second = two();
	});

	it("async variant", async () => {
		// from issue #3 on github
		const bla = async () => "hello";

		const TaskExtractMetadata = variation("extract_metadata", async () => {
			// do async stuff
			const stuff1 = await bla();
			return {
				stuff1,
			};
		});

		const thing = await TaskExtractMetadata();

		expect(thing.type).to.equal("extract_metadata");
		expect(thing.stuff1).to.equal("hello");
	});

	it("async variation output types", async () => {
		const nonce = Promise.resolve(5);

		const AsyncTask = variation("A_TASK", async () => ({
			nonce: await nonce,
			four: 4,
		}));

		const result = AsyncTask();

		expect(AsyncTask.output.type).to.equal("A_TASK");
		expect(AsyncTask.output.key).to.equal("type");

		expect(
			(
				result as unknown as {
					four?: number;
				}
			).four,
		).to.equal(undefined);
		expect((await result).four).to.equal(4);
	});

	it("descope", () => {
		const scopedLabel = variation("scope/label");
		const scopedInstance = scopedLabel();

		const descopedInstance = descope(scopedInstance);

		expect(descopedInstance.type).to.equal("label");
	});
};
