--!strict
--!native
--!optimize 2

local function identityFunc(...)
	return ...
end

local function HOI()
	return identityFunc
end

local exports = {
	identityFunc = identityFunc,
	HOI = HOI,
}

return exports
