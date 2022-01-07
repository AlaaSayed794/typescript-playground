# image processing api 

## Getting Started

### Installing Dependencies

project requires having node installed https://nodejs.org/en/download/

run ```npm install``` to install the dependencies

## API Reference

### Getting Started
- Base URL: this app is hosted locally at `http://127.0.0.1:3000/` 
- Authentication: no authentication required. 

### Error Handling

returned error codes:
- 400: Bad Request

### Endpoints 
### GET / 
- General:
    - Returns a message in response text to hit the main api/images endpoint
- Sample: `curl http://127.0.0.1:3000`

#### GET /api
- General:
    - Returns a message in response text to hit the main api/images endpoint
- Sample: `curl http://127.0.0.1:3000/api`

#### GET /api/images
- takes query parameters and returns a resized image for the user
- `curl http://127.0.0.1:3000/api/images?filename={validFile}`

returns original image or 400 if file does not exist
- `curl http://127.0.0.1:3000/api/images?filename={validFile}&width={missingOrInvalidNum}&height={missingOrInvalidNum}`

still returns original image or 400 if file does not exist

- `curl http://127.0.0.1:3000/api/images?filename={validFile}&width={validNum}&height={missingOrInvalidNum}`

returns resized image of specified width and original height or 400 if file does not exist

- `curl http://127.0.0.1:3000/api/images?filename={validFile}&width={missingOrInvalidNum}&height={validNum}`

returns resized image of specified height and original width or 400 if file does not exist

- `curl http://127.0.0.1:3000/api/images?filename={validFile}&width={validNum}&height={validNum}`

returns resized image of specified height and width or 400 if file does not exist

#### Author:
<sup>Alaa Sayed

## Acknowledgements 
The awesome team at Udacity
sharp docs https://sharp.pixelplumbing.com/api-input#metadata
eslint docs https://eslint.org/docs/user-guide/command-line-interface


## Testing
Testing is done using jasmine
To run the tests, run
```
npm run test
```