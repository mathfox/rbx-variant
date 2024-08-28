import { fields } from "./variant.tools";

const value_1 = fields<{
	name: string;
	damage: number;
}>();

const test_1 = value_1({
	damage: 3,
	name: "test",
});

const value_2 = fields();

const test_2 = value_2();
