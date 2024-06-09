import { generateSignature } from "../src/utils";

test("generateSignature should create correct HMAC signature", () => {
  const amount = 100;
  const reference = "KF/2014";
  const secret = "test_secret";
  const expectedSignature = "zXXwmHYLpBVrFLvN3r8JTWJmPjWIaJHpRmxX+PhVzUo=";

  const signature = generateSignature(amount, reference, secret);

  expect(signature).toBe(expectedSignature);
});
