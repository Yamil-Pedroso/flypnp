import { describe, expect, it } from "vitest";
import {
  createGiftCardCode,
  decryptGiftCardCode,
  encryptGiftCardCode,
  hashGiftCardCode,
} from "../services/giftCardService";

describe("gift card code security", () => {
  it("creates a shareable high-entropy code without storing it in plaintext", () => {
    const code = createGiftCardCode();
    const encrypted = encryptGiftCardCode(code);

    expect(code).toMatch(/^FLY-[A-F0-9]{5}(?:-[A-F0-9]{5}){3}$/);
    expect(encrypted).not.toContain(code);
    expect(decryptGiftCardCode(encrypted)).toBe(code);
  });

  it("normalizes separators and case before hashing a redemption code", () => {
    expect(hashGiftCardCode("fly-abc12-def34")).toBe(hashGiftCardCode("FLY ABC12 DEF34"));
  });
});
