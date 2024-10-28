const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");
const ApiError = require("../../../utils/apiErrors");

const list = catchAsync(async (req, res) => {
  const { id } = await pick(req.params, ["id"]);
  console.log("req.params",req.params);
  
  const data = await service.getUserById(id);
  if(data){
      sendResponse(res, 200, data, null);
  } else {
    throw new ApiError(400, "User not found", {}, "")
  }
});

module.exports = list;
