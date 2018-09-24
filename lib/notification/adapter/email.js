const nodemailer = require('nodemailer');
const config = require('../../../conf/config.json');

const transporter = nodemailer.createTransport({
    host: config.notification.email.host,
    port: config.notification.email.port,
    secure: config.notification.email.secure,
    auth: {
        user: config.notification.email.username,
        pass: config.notification.email.password
    }
});

/**
 * sends a new listing via email
 * @param serviceName e.g immoscout
 * @param newListings an array with newly found listings
 * @returns {Promise<> | void}
 */
exports.send = (serviceName, newListings) => {
    let text = `New Listing(s) from service ${serviceName}:\n\n` +  newListings.map(payload => {
      return `Listing: *(${serviceName})* - ${payload.title}\nLink to Exposé: ${payload.link}\nSize: ${payload.size}, Price: ${payload.price}\nAddress: ${payload.address}\n\n`;
    });

    let options = {
        from: config.notification.email.sender,
        to: config.notification.email.receiver,
        subject: config.notification.email.title,
        text: text
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(options, (error, info) => {
            if (error) {
                return reject(error);
            }

            resolve(info);
        });
    });
};

/**
 * each integration needs to implement this method
 */
exports.enabled = () => {
    return config.notification.email.enabled;
};
