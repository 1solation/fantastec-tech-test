import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

import schema from "./schema";

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const email = event.body?.email;
  const location = event.body?.location;

  // features which have the email explicitly enabled
  const explicitFeaturesEnabledEmail = featureData
    .filter((feature) => feature.enabledEmails.includes(email as string))
    .map((feature) => feature.name);

  // features which have the email implicitly enabled, i.e auto enrolled
  const autoEnrolledFeaturesEmail = featureData
    .filter((feature) => feature.enabledEmails.length === 0)
    .map((feature) => feature.name);

  // full list of enabled features by email
  const allEnabledFeaturesEmail = [
    ...explicitFeaturesEnabledEmail,
    ...autoEnrolledFeaturesEmail,
  ];

  // features which have the location explicitly enabled
  const explicitFeaturesEnabledLocation = featureData
    .filter((feature) => feature.includedCountries.includes(location as string))
    .map((feature) => feature.name);

  // features which have the location implicitly enabled, i.e auto enrolled
  const autoEnrolledFeaturesLocation = featureData
    .filter((feature) => feature.includedCountries.length === 0)
    .map((feature) => feature.name);

  // full list of enabled features by location
  const allEnabledFeaturesLocation = [
    ...explicitFeaturesEnabledLocation,
    ...autoEnrolledFeaturesLocation,
  ];

  // remove duplicate values
  const mergeDedupe = (arr) => {
    return [...new Set([].concat(...arr))];
  };

  if (email && location) {
    return apiResponse._200({
      message: `Enabled features for email:${email} and location:${location}`,
      featuresEnabledEmail: mergeDedupe(allEnabledFeaturesEmail),
      featuresEnabledLocation: mergeDedupe(allEnabledFeaturesLocation),
    });
  }
  if (email) {
    return apiResponse._200({
      message: `Enabled features for email:${email}`,
      featuresEnabled: mergeDedupe(allEnabledFeaturesEmail),
    });
  }
  if (location) {
    return apiResponse._200({
      message: `Enabled features for location:${location}`,
      featuresEnabled: mergeDedupe(allEnabledFeaturesLocation),
    });
  }
  return apiResponse._400({
    message: "Bad request",
  });
};

// keep responses tidy
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

// TODO remove, ease of use while deving
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
