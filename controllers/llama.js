const { StatusCode } = require('../utilities/KeyMaster');
const { getError } = require('../utilities/Exceptions');
const {
	Document,
	VectorStoreIndex,
	Settings,
	Ollama,
	OllamaEmbedding,
} = require('llamaindex');
const pdfParse = require('pdf-parse');
const fs = require('fs-extra');
const path = require('path');
const { decrypt, secretKey } = require('../utilities/Utility');

module.exports = {
	upload: () => {
		try {
			return {
				result: {
					status: StatusCode.SUCCESS,
					data: data,
				},
			};
		} catch (err) {
			return { error: exceptions.getError(err) };
		}
	},
	chat: async ({ query, hash }) => {
		try {
			if (!query) {
				return res.status(400).json({ error: 'No query provided' });
			}
			const dataBuffer = await fs.readFile(decrypt(hash, secretKey));
			const pdfData = await pdfParse(dataBuffer);

			const document = new Document({ text: pdfData.text });
			index = await VectorStoreIndex.fromDocuments([document]);

			const queryEngine = index.asQueryEngine();

			const data = await queryEngine.query({ query: query });

			return {
				result: {
					status: StatusCode.SUCCESS,
					data: data.response,
				},
			};
		} catch (err) {
			return { error: getError(err) };
		}
	},
};
