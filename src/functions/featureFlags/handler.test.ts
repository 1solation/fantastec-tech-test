import { mocked } from "ts-jest/utils";
import { Handler } from "aws-lambda";

import { middyfy } from "@libs/lambda";

jest.mock("@libs/lambda");

describe("hello", () => {
  let main;
  let mockedMiddyfy: jest.MockedFunction<typeof middyfy>;

  beforeEach(async () => {
    mockedMiddyfy = mocked(middyfy);
    mockedMiddyfy.mockImplementation((handler: Handler) => {
      return handler as never;
    });

    main = (await import("./handler")).main;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return status code 400 when passed unrecognised key", async () => {
    const event = {
      body: {
        unrecognisedKey: "unrecognisedValue",
      },
    } as any;
    const actual = await main(event);
    expect(actual).toEqual({
      body: '{"statusCode":400,"body":{"message":"Bad request"}}',
      statusCode: 200,
    });
  });
  it("should return correct feature flags when passed email", async () => {
    const event = {
      body: {
        email: "fred@example.com",
      },
    } as any;
    const actual = await main(event);
    expect(actual).toEqual({
      body: '{"statusCode":200,"body":{"message":"Enabled features for email:fred@example.com","featuresEnabled":["SuperCoolFeature","SimplifiedNavBar","MarketingBanner"]}}',
      statusCode: 200,
    });
  });
  it("should return correct feature flags when passed location", async () => {
    const event = {
      body: {
        location: "US",
      },
    } as any;
    const actual = await main(event);
    expect(actual).toEqual({
      body: '{"statusCode":200,"body":{"message":"Enabled features for location:US","featuresEnabled":["MarketingBanner","EnhancedDashboardFeature","SimplifiedNavBar","NewUserOnboardingJourney"]}}',
      statusCode: 200,
    });
  });
  it("should return correct feature flags when passed BOTH email and location", async () => {
    const event = {
      body: {
        email: "fred@example.com",
        location: "US",
      },
    } as any;
    const actual = await main(event);
    expect(actual).toEqual({
      body: '{"statusCode":200,"body":{"message":"Enabled features for email:fred@example.com and location:US","featuresEnabledEmail":["SuperCoolFeature","SimplifiedNavBar","MarketingBanner"],"featuresEnabledLocation":["MarketingBanner","EnhancedDashboardFeature","SimplifiedNavBar","NewUserOnboardingJourney"]}}',
      statusCode: 200,
    });
  });
});
