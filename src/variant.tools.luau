--!native
--!strict
--!optimize 2

local function fields()
	return function(input)
		if not input then
			return {}
		end

		return table.clone(input)
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
