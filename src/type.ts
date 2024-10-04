import { variantCosmos } from "./cosmos";

export const {
	descope,
	flags,
	isOfVariant,
	isType,
	match,
	matcher,
	ofLiteral,
	otherwise,
	partial,
	prematch,
	remote,
	scoped,
	sequence,
	lookup,
	variant,
	variantList,
	variantModule,
	variation,
	withFallback,
} = variantCosmos({ key: "type" });
