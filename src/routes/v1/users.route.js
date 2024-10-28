const express = require('express');
const validate = require('../../middlewares/validate');
const Validation = require('../../modules/user/validation');
const Controller = require('../../modules/user/controllers');
// const auth = require('../../middlewares/auth');

const router = express.Router();

router.route('/list')
    .get( Controller.listControllerWithoutLimit)

router.route('/')
    .get(Controller.listController)

router.route('/:id')
    .post(validate(Validation.update), Controller.update)
    .get(Controller.getSingleUser);

router.route('/update-user-with-pass/:id')
    .post(validate(Validation.updateWithPass), Controller.updatePassword)
    
    // .post(auth("update-password"), validate(Validation.updateWithPass), Controller.updatePassword)
module.exports = router;