const crypto = require('crypto');
var CryptoJS = require('crypto-js');
// const bcrypt = require('bcrypt');
/**
 *
 * @param {string} email Email to be validated
 * @returns {boolean} true if email is valid else false
 */
const isEmailValid = function (email) {
	const validationRegex = new RegExp(
		/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g,
	);

	return validationRegex.test(email);
};

/**
 *
 * @param {string} password Password to be validated
 */
const isPasswordValid = function (password) {
	const validationRegex =
		/(^(?=.*[~|`|!|@|#|$|%|^|&|*|(|)|_|=|+|-])[0-9a-zA-Z~`!@#$%^&*()_=+-]{10,})/g;
	return validationRegex.test(password);
};

const isUsernameValid = function (username) {
	const validationRegex = /(^[A-Za-z0-9_]{3,})+$/g;
	return validationRegex.test(username);
};
/**
 *
 * @param {string} text Text that you want to capitalize
 * @example toCapitalizedCase(text)
 * @returns {string} Capitalized Text
 */

const getStandardString = function (text) {
	return text.replace(/_|:|-/g, ' ').replace(/ +(?= )/g, '');
};

const replaceSpace = function (text) {
	return text.replace(/ /g, '_');
};

const getVaultKey = function (user, type, institution) {
	return `${user.tenant_id}_${user.client_id}/${replaceSpace(
		type,
	)}/${replaceSpace(institution)}`;
	// return `${user.id}_${user.tenant_id}/${domain}`;
};
const getHostName = function (webUrl) {
	const url = new URL(webUrl);
	return url.hostname.split('.')[1];
};

/**
 *
 * @param {Date} date
 * @param {number} numWeeks
 * @returns
 */
const getDateAfterWeeks = (date, numWeeks) => {
	date.setDate(date.getDate() + numWeeks * 7);
	return date;
};

// Encryption function
function encrypt(text, key) {
	var encrypted = CryptoJS.AES.encrypt(JSON.stringify(text), key).toString();
	return encrypted;
}

// Decryption function
function decrypt(encryptedText, key) {
	var bytes = CryptoJS.AES.decrypt(encryptedText, key);
	var decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
	return decrypted;
}

const secretKey =
	process.env.SECRET_KEY || crypto.randomBytes(32).toString('hex');

module.exports = {
	isEmailValid,
	getStandardString,
	isPasswordValid,
	isUsernameValid,
	getVaultKey,
	getHostName,
	getDateAfterWeeks,
	encrypt,
	decrypt,
	secretKey,
};
