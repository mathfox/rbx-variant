import { fields } from "../variant.tools";

// Basic usage
const value_1 = fields<{
	name: string;
	damage: number;
}>();

const test_1 = value_1({
	damage: 3,
	name: "test",
});

// An empty usage.
// Usually a case when we have not yet decided on the record structure.
const value_2 = fields();

const test_2 = value_2();

// These ones should error,
// as we are not using the record.

// @ts-expect-error
const error_1 = fields<Workspace>();

// @ts-expect-error
const error_2 = fields<object>();
