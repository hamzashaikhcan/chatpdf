const express = require('express');
const multer = require('multer');
const fs = require('fs-extra');
const path = require('path');
const {
	Document,
	VectorStoreIndex,
	Settings,
	Ollama,
	OllamaEmbedding,
} = require('llamaindex');
const pdfParse = require('pdf-parse');
const cors = require('cors');
const { crossOriginResource } = require('./utilities/Middleware');

const app = express();
const port = 3000;
const router = require('./routes');

const embeddingModel = 'nomic-embed-text';
const ollamaModel = 'llama3';
Settings.llm = new Ollama({ model: ollamaModel });
Settings.embedModel = new OllamaEmbedding({ model: embeddingModel });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(crossOriginResource);
app.use(cors());
app.use(router);

// app.post('/upload', upload.single('file'), async (req, res) => {
// 	try {
// 		const filePath = req.file.path;

// 		res.json({
// 			message: 'File uploaded and indexed successfully',
// 			filePath: filePath,
// 		});
// 	} catch (error) {
// 		console.log('error: ', error);
// 		res.status(500).json({ error: 'Failed to process the file' });
// 	}
// });

// app.post('/query', express.json(), async (req, res) => {
// 	try {
// 		const query = req.body.query;
// 		const filePath = req.body.filePath;

// 		if (!query) {
// 			return res.status(400).json({ error: 'No query provided' });
// 		}

// 		// if (!index) {
// 		// 	return res.status(400).json({ error: 'No document indexed' });
// 		// }

// 		const dataBuffer = await fs.readFile(filePath);
// 		const pdfData = await pdfParse(dataBuffer);

// 		const document = new Document({ text: pdfData.text });
// 		index = await VectorStoreIndex.fromDocuments([document]);

// 		const queryEngine = index.asQueryEngine();

// 		const response = await queryEngine.query({ query: query });

// 		res.json({ response: response.toString() });
// 	} catch (error) {
// 		res.status(500).json({ error: 'Failed to query the index' });
// 	}
// });

// Start the server
app.listen(port, () => {
	console.clear();
	console.log(`Server is running on http://localhost:${port}`);
});
