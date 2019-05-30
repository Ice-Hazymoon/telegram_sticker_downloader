
const winston = require('winston');

module.exports = function(cli){
    const logger = winston.createLogger({
        level: 'info',
        format: winston.format.json()
    });

    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
            silent: !cli
        })
    );
    return logger;
};