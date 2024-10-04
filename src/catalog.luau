--!strict
--!native
--!optimize 2

local function catalog<TKey>(strings: { TKey }): { [TKey]: TKey }
	local output: { [TKey]: TKey } = {}

	for _, key in strings do
		output[key] = key
	end

	return output
end

return catalog
