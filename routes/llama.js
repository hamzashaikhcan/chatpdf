const router = require('express').Router();
const multer = require('multer');
const fs = require('fs-extra');
const path = require('path');
const llama = require('../controllers/llama');
const { encrypt, secretKey } = require('../utilities/Utility');

// Configure multer for file uploads
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const uploadPath = 'uploads/';
		// Ensure the uploads directory exists
		if (!fs.existsSync(uploadPath)) {
			fs.mkdirSync(uploadPath, { recursive: true });
		}
		cb(null, uploadPath);
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
		cb(
			null,
			file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname),
		);
	},
});

const upload = multer({
	storage: storage,
	limits: { fileSize: 5 * 1024 * 1024 }, // limit file size to 5MB
	fileFilter: (req, file, cb) => {
		const fileTypes = /pdf/;
		const extname = fileTypes.test(
			path.extname(file.originalname).toLowerCase(),
		);
		const mimetype = fileTypes.test(file.mimetype);
		if (mimetype && extname) {
			return cb(null, true);
		} else {
			cb(new Error('Only PDFs are allowed'));
		}
	},
});

router.post('/upload', upload.single('file'), async (req, res) => {
	try {
		const filePath = req.file.path;

		const originalName = req.file.originalname;
		const fileSize = req.file.size / 1024;
		const fileFormat = req.file.mimetype;

		console.log('secretKey: ', secretKey);
		res.json({
			message: 'File uploaded and indexed successfully',
			originalName: originalName,
			fileSize: `${fileSize.toFixed(2)} KB`,
			fileFormat: fileFormat,
			hash: encrypt(filePath, secretKey),
		});
	} catch (error) {
		console.log('error: ', error);
		res.status(500).json({ error: 'Failed to process the file' });
	}
});

router.post('/chat', async (req, res) => {
	const data = await llama.chat(req.body);
	res.send(data);
});

module.exports = router;
