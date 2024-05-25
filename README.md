# Chat with Llama3

Description of your project goes here.

## Table of Contents

- [Chat with Llama3](#chat-with-llama3)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Endpoints](#endpoints)
    - [Upload File](#upload-file)
    - [Example Response](#example-response)
    - [Query Document](#query-document)
    - [Example Response](#example-response-1)
  - [Contributing](#contributing)
  - [License](#license)

## Installation

1. Clone the repository.

2. Navigate to the project directory.

3. Run `npm install` or `yarn install` to install dependencies.

## Usage

1. Start the server by running `npm start` or `yarn start`.

2. Use Postman or any other API testing tool to interact with the endpoints.

## Endpoints

### Upload File

- **URL:** `/api/upload`

- **Method:** POST

- **Description:** Uploads a PDF file to the server.

- **Request Body:** Form data with a single field named "file" containing the PDF file.

- **Response:** JSON object with details about the uploaded file, including its original name, size, and format.

### Example Response

```json
{
	"message": "File uploaded and indexed successfully",

	"originalName": "Homitag Documentation.pdf",

	"fileSize": "841.70 KB",

	"fileFormat": "application/pdf",

	"hash": "U2FsdGVkX19QJybvNhrHcAOBr3c1yYiuuXNq8u2bvpv3KgXvRDvwFEJKlbfryUdxInAG3xUZh3JOLJkngswlpA=="
}
```

### Query Document

- **URL:** `/api/chat`

- **Method:** POST

- **Description:** Uploads a PDF file to the server.

**Example Body:**

```json
{
	"query": "How many user types are there in Homitag?",

	"hash": "{{hash}}"
}
```

### Example Response

```json
{
	"result": {
		"status": 200,

		"data": "Based on the provided context information, there are five user types in Homitag:\n\n1. Buyers\n2. Suppliers\n3. Sellers\n4. Admin\n5. (Note: The context mentions \"sub-users\" for Admins, but it's not explicitly stated as a separate user type. However, it can be inferred that sub-users are part of the overall Admin category.)"
	}
}
```

## Contributing

Contributions are welcome! Please follow the [Contributing Guidelines](CONTRIBUTING.md).

## License

This project is licensed under the [MIT License](LICENSE).

---

You can customize this template as needed to provide more specific details about your project. Feel free to add sections such as "Deployment", "Testing", or "Acknowledgements" depending on your project's requirements.
