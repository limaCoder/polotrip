import { api } from "../api";
import type { CreateCheckoutRequest, CreateCheckoutResponse } from "./types";

export async function createCheckout({
  body,
}: CreateCheckoutRequest): Promise<CreateCheckoutResponse> {
  try {
    const data = await api.post<CreateCheckoutResponse>("v1/checkout", {
      json: body,
    });

    return data;
  } catch (error) {
    throw new Error(`Failed to create checkout: ${error}`);
  }
}
