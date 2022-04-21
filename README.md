# Fantastec Tech Test

Original tech test repository along with the specification is located [here](https://gitlab.com/fantastec/be-interviewee-code-test)

This repository is using Node version v17.xx
please ensure you are using Node version v17.xx, if you have nvm you can execute the following command
`nvm use 17`

## Assumptions

- You have a valid CLI (Command Line Interface)

- You have Node & NPM installed

This repository was programmed and confirmed working with Node v17.7.1, other Node versions may or may not work

## Installation

Once in the directory, in the terminal run `npm i` to install all project dependencies

## Running the API locally

You can run the API in 2 ways:

- Running the API locally via `npm run`
- Running against mocked data via `serverless invoke local`

### Running a the API Locally

To run the API locally, in the root directory execute `npm run offline` to start up the serverless-offline and run the API.

This will be running on port 3000 with the full URL at `localhost:3000/featureFlags`

To run a successful API query execute a POST request with the body being 1 of 3 options:

**Option 1: only email**
`{ "email": "fred@example.com" }`
**Option 2: only location**
`{ "location": "US" }`
**Option 3: both email and location**
`{ "email": "fred@example.com", "location": "US" }`

### Run against mocked data with serverless invoke

Once in the root directory, run `serverless invoke local --function featureFlags --path src/functions/featureFlags/mock.json` and you should see output similar to the following:

` "statusCode": 200, "body": "{\"statusCode\":200,\"body\":{\"message\":\"Enabled features for email:fred@example.com and location:US\",\"featuresEnabledEmail\":[\"SuperCoolFeature\",\"SimplifiedNavBar\",\"MarketingBanner\"],\"featuresEnabledLocation\":[\"MarketingBanner\",\"EnhancedDashboardFeature\",\"SimplifiedNavBar\",\"NewUserOnboardingJourney\"]}}" }`

## Running tests

To run the jest unit tests run `npm run test` in the terminal

Source code is located in `./src/` and tests are in `./test/`

## Project Structure

### Serverless - AWS Node.js Typescript

This project has been generated using the `aws-nodejs-typescript` template from the [Serverless framework](https://www.serverless.com/).

For detailed instructions, please refer to the [documentation](https://www.serverless.com/framework/docs/providers/aws/).

The project code base is mainly located within the `src` folder. This folder is divided in:

- `functions` - containing code base and configuration for the lambda functions

- `libs` - containing shared code base between the lambdas

```
.
├── src
│   ├── functions               # Lambda configuration and source code folder
│   │   ├── featureFlags
│   │   │   ├── handler.ts      # lambda source code
│   │   │   ├── example_users.json      # list of example users
│   │   │   ├── features.json      # list of feature flags
│   │   │   ├── handler.test.ts # lambda unit tests
│   │   │   ├── index.ts        # lambda Serverless configuration
│   │   │   ├── mock.json       # lambda input parameter, if any, for local invocation
│   │   │   └── schema.ts       # lambda input event JSON-Schema
│   │   │
│   │   └── index.ts            # Import/export of all lambda configurations
│   │
│   └── libs                    # Lambda shared code
│       └── apiGateway.ts       # API Gateway specific helpers
│       └── handlerResolver.ts  # Sharable library for resolving lambda handlers
│       └── lambda.ts           # Lambda middleware
│
├── package.json
├── serverless.ts               # Serverless service file
├── tsconfig.json               # Typescript compiler configuration
├── tsconfig.paths.json         # Typescript paths
└── webpack.config.js           # Webpack configuration
```

### 3rd party libraries

- [json-schema-to-ts](https://github.com/ThomasAribart/json-schema-to-ts) - uses JSON-Schema definitions used by API Gateway for HTTP request validation to statically generate TypeScript types in your lambda's handler code base

- [middy](https://github.com/middyjs/middy) - middleware engine for Node.Js lambda. This template uses [http-json-body-parser](https://github.com/middyjs/middy/tree/master/packages/http-json-body-parser) to convert API Gateway `event.body` property, originally passed as a stringified JSON, to its corresponding parsed object

- [@serverless/typescript](https://github.com/serverless/typescript) - provides up-to-date TypeScript definitions for your `serverless.ts` service file

- [jest](https://github.com/facebook/jest) - javascript testing framework

### Future Considerations & Thoughts/Ramblings

- More time & thinking needed: Did not implement ratio in the API response, something to improve on. Although, the feature flags returned by the API for a given user are always consistent (i.e all features appear to be turned on)
- Add tests for unhappy path scenarios & appropriate error handling for these paths (e.g. if email/location does not exist in data)
- Update `src/libs/api-gateway.ts` to take status code as a param, give default of 200 for this tech test example
  - would not have to return 200 for lambda successful execution then custom status code in the body this way
- Create middleware factory using middy to allow me to use after and onError middy syntax & then register new middleware to our function, keeps code clean and abstracts from the json parsing all over the place & allows us to return a result from the lambda without calling the format function `formatJSONResponse` in our code
- Don't leave JSON data in lambda handler, this was rushed due to personal circumstances & is not by any means a perfect solution
