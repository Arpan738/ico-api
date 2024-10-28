const express = require('express');
const userRoutes = require("./users.route")
const authRoutes = require("./auth.route")

const router = express.Router();

const defaultRoutes = [
	{
		path: '/auth',
		route: authRoutes,
	},
	{
			path: '/user',
			route: userRoutes,
		},
];


defaultRoutes.forEach((route) => {
	router.use(route.path, route.route);
});

module.exports = router;