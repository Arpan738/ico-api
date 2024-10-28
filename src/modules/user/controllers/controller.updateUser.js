const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");
const ApiError = require("../../../utils/apiErrors");

const updateUser = catchAsync(async (req, res) => {
	const body = req.body;
	let userId = req.params.id;

	const user = await service.update(userId, body)
	if(user) sendResponse(res, httpStatus.OK, "User updated", null)
	else throw new ApiError(httpStatus.BAD_REQUEST, "Not able to update", false, "")
});

module.exports = updateUser