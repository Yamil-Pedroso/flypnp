import { http } from "./http";
import type { ApiResponse, GiftCardSummary, GiftCardPurchase } from "./types";

export const giftCardsService = {
  async summary() {
    return (await http.get<ApiResponse<GiftCardSummary>>("/gift-cards")).data.data;
  },
  async purchase(input: {
    amount: number;
    recipientName: string;
    recipientEmail: string;
    message?: string;
    purchaseKey: string;
  }) {
    return (await http.post<ApiResponse<GiftCardPurchase> & {
      clientSecret: string;
      alreadyPaid: boolean;
    }>("/gift-cards/purchase", input)).data;
  },
  async confirm(id: string) {
    return (await http.post<ApiResponse<GiftCardPurchase> & { code: string }>(
      `/gift-cards/${id}/confirm`,
    )).data;
  },
  async redeem(code: string) {
    return (await http.post<ApiResponse<{ balance: number; amount: number; currency: "chf" }>>(
      "/gift-cards/redeem",
      { code },
    )).data.data;
  },
};
