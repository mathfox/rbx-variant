--!strict
--!native
--!optimize 2

local function construct(cls)
	return cls.new
end

return construct
