const express = require('express');
const validate = require('../../middlewares/validate');
const userValidation = require('../../modules/user/validation');
const userController = require('../../modules/user/controllers');
// const auth = require('../../middlewares/auth');

const router = express.Router();

router.route('/login').post(validate(userValidation.login), userController.login);
router.route('/').get(userController.list)

router.route('/:id')
    .post(validate(userValidation.update), userController.updateUser)
    .get(userController.getUserById);


module.exports = router;