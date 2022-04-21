import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

import schema from "./schema";

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const feature = event.body?.name;
  const email = event.body?.email;
  const location = event.body?.location;
  const emailLookup = Object.keys(featureData);

  // ✅ Using Object.entries()
  let result2;

  Object.entries(featureData).find(([key, value]) => {
    if (value === email) {
      result2 = key;
      return true;
    }

    return false;
  });

  if (email) {
    return apiResponse._200({
      message: `if email ${email}`,
      emailLookup,
      result2,
    });
  }
  if (location) {
    return apiResponse._200({
      message: `you are looking for features in ${location}`,
    });
  }
  if (!feature || !featureData[feature]) {
    return apiResponse._400({
      message: "Missing feature or no data for that feature",
    });
  }
  return apiResponse._200(featureData[feature]);
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

interface FeatureData {
  name: string;
  ratio: number;
  enabledEmails?: Array<string>;
  includedCountries?: Array<string>;
  excludedCountries?: Array<string>;
}
interface FeatureDataEmails {
  enabledEmails: Array<string>;
}
// intersection types to index by feature name and by enabledEmails
type FeatureDataIntersection = FeatureData & FeatureDataEmails;

const featureData: { [key: string]: FeatureDataIntersection } = {
  SuperCoolFeature: {
    name: "SuperCoolFeature",
    ratio: 0.5,
    enabledEmails: ["fred@example.com", "mike@example.com"],
    includedCountries: ["GB"],
    excludedCountries: [],
  },
  MarketingBanner: {
    name: "MarketingBanner",
    ratio: 1,
    enabledEmails: [],
    includedCountries: ["US"],
    excludedCountries: [],
  },
  SimplifiedNavBar: {
    name: "SimplifiedNavBar",
    ratio: 0,
    enabledEmails: ["fred@example.com"],
    includedCountries: [],
    excludedCountries: [],
  },
  EnhancedDashboardFeature: {
    name: "EnhancedDashboardFeature",
    ratio: 0.5,
    enabledEmails: ["jacob@example.com"],
    includedCountries: ["US", "CA"],
    excludedCountries: [],
  },
  NewUserOnboardingJourney: {
    name: "NewUserOnboardingJourney",
    ratio: 0.25,
    enabledEmails: ["tom@example.com"],
    includedCountries: [],
    excludedCountries: ["CA", "GB"],
  },
};

export const main = middyfy(handler);
