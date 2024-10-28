const mongoose = require('mongoose');
const config = require('./config/config');
const app = require('./app');
const logger = require('./config/logger');


let server;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
	logger.info('Connected to MongoDB');
	server = app.listen(config.port, () => {
		logger.info(`Listening to port ${config.port}`);
	});
}).catch((error) => {
	logger.error("MongoDB Handshake Failed :", error)
});

const exitHandler = () => {
	if (server) {
		server.close(() => {
			logger.info('Server closed');
			process.exit(0);
		});
	} else {
		process.exit(0);
	}
};

const unexpectedErrorHandler = (error) => {
	logger.error(error);
	exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
	logger.info('SIGTERM received');
	if (server) {
		server.close((err) => {
			if (err) {
				logger.error('Error closing server:', err);
				process.exit(1);
			} else {
				logger.info('Server closed gracefully');
				process.exit(0);
			}
		});
	} else {
		process.exit(0);
	}
});
