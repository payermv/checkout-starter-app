import crypto from "crypto";

/**
 * Generate a HMAC signature for the given amount and reference
 *
 * @param amount The amount in cents
 * @param reference Unique reference for the transaction
 * @param secret API secret provided by Payer
 * @returns The HMAC signature
 */
export const generateSignature = (
  amount: number,
  reference: string,
  secret: string
): string => {
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(`${amount}${reference}`);
  return hmac.digest("base64");
};
