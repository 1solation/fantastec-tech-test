import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

import schema from "./schema";

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const email = event.body?.email;
  const location = event.body?.location;

  const featuresEnabledEmail = featureData.filter((feature) => {
    if (email === feature.enabledEmails.values) {
      return feature.name;
    }
    return `Email ${email} is not in enabledEmails`;
  });

  const featuresEnabledLocation = featureData.filter((feature) => {
    if (location === feature.includedCountries.values) {
      return feature.name;
    }
    return `Email ${location} is not in includedCountries`;
  });

  if (email) {
    return apiResponse._200({
      message: `if email ${email}`,
      featuresEnabled: featuresEnabledEmail,
    });
  }
  if (location) {
    return apiResponse._200({
      message: `if location ${location}`,
      featuresEnabled: featuresEnabledLocation,
    });
  }
  return apiResponse._400({
    message: "Bad request",
  });
};

const apiResponse = {
  _200: (body: { [key: string]: any }) => {
    return formatJSONResponse({
      statusCode: 200,
      body: body,
    });
  },
  _400: (body: { [key: string]: any }) => {
    return formatJSONResponse({
      statusCode: 400,
      body: body,
    });
  },
};

const featureData = [
  {
    name: "SuperCoolFeature",
    ratio: 0.5,
    enabledEmails: ["fred@example.com", "mike@example.com"],
    includedCountries: ["GB"],
    excludedCountries: [],
  },
  {
    name: "MarketingBanner",
    ratio: 1,
    enabledEmails: [],
    includedCountries: ["US"],
    excludedCountries: [],
  },
  {
    name: "SimplifiedNavBar",
    ratio: 0,
    enabledEmails: ["fred@example.com"],
    includedCountries: [],
    excludedCountries: [],
  },
  {
    name: "EnhancedDashboardFeature",
    ratio: 0.5,
    enabledEmails: ["jacob@example.com"],
    includedCountries: ["US", "CA"],
    excludedCountries: [],
  },
  {
    name: "NewUserOnboardingJourney",
    ratio: 0.25,
    enabledEmails: ["tom@example.com"],
    includedCountries: [],
    excludedCountries: ["CA", "GB"],
  },
];

export const main = middyfy(handler);
