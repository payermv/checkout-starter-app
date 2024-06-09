# payer-checkout-starter-app

## Description

This is a Node.js starter app to integrate with Payer Checkout API. The app collects transactions details from a form and initiates a checkout session with the API.

## Prerequisites

- Node.js
- npm

## Setup

1. Clone the repository:

```bash
git clone https://github.com/payermv/payer-checkout-starter-app.git
```

2. Navigate to the project directory:

```bash
cd payer-checkout-starter-app
```

3. Install dependencies:

```
npm install
```

4. Create a .env file in the root directory and add your tokens:

```
PAYER_API_HOST=https://api.nonprod.payer.app
PAYER_API_TOKEN=
PAYER_API_SECRET=
```

You can generate the API Key and Secret from the Payer Merchant Portal.

5. Start the application:

```
npm run dev
```

## Usage

- Open your browser and go to http://localhost:3000.
- Fill in the transactions details and submit the form.
- You will be redirected to the checkout URL provided by the API.

## Running tests

To run the tests, use the following command:

```
npm run test
```

## License

This project is licensed under the MIT License.
