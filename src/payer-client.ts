import axios from "axios";

interface CheckoutSessionPayload {
  title: string;
  amount: number;
  reference: string;
  signature: string;
}

class PayerClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async createCheckoutSession(payload: CheckoutSessionPayload) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/checkout/sessions`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${process.env.PAYER_API_TOKEN}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      // Remove type annotation from catch clause variable
      // @ts-ignore
      throw new Error(`Failed to create checkout session: ${error.message}`);
    }
  }

  // Additional methods for other API endpoints can be added here
}

export default PayerClient;
