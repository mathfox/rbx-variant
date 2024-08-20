--!native

local function fields(defaults)
	return function(input)
		if not input then
			return {}
		end

		local variant = table.clone(defaults)

		for key, value in input do
			variant[key] = value
		end

		return variant
	end
end

local function payload()
	return function(payload)
		return {
			payload = payload,
		}
	end
end

local function none()
	return function()
		return {}
	end
end

return {
	fields = fields,
	payload = payload,
	none = none,
}
