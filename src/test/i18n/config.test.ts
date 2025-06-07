import { beforeEach, describe, expect, it, vi } from "vitest";
import i18n from "../../i18n/config";
import itTranslations from "../../i18n/translations/it";
import roTranslations from "../../i18n/translations/ro";

describe("i18n Configuration", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("has loaded Italian and Romanian translations", () => {
    // Check that Italian translations are loaded
    expect(i18n.hasResourceBundle("it", "translation")).toBe(true);

    // Check that Romanian translations are loaded
    expect(i18n.hasResourceBundle("ro", "translation")).toBe(true);
  });
  it("uses Italian as default language", () => {
    // Default language should be Italian
    expect(i18n.language).toBe("it");

    // Default fallback should be Italian (checking first element if it's an array)
    expect(
      Array.isArray(i18n.options.fallbackLng)
        ? i18n.options.fallbackLng[0]
        : i18n.options.fallbackLng
    ).toBe("it");
  });
  it("changes language correctly", () => {
    // Change to Romanian
    i18n.changeLanguage("ro");
    expect(i18n.language).toBe("ro");

    // Test that key is translated correctly
    const translatedText = i18n.t("gallery.title");
    const expectedRomanianText = roTranslations["gallery.title"]; // Access as dictionary
    expect(translatedText).toBe(expectedRomanianText);

    // Change back to Italian
    i18n.changeLanguage("it");
    expect(i18n.language).toBe("it");

    // Test that key is translated correctly in Italian
    const italianText = i18n.t("gallery.title");
    const expectedItalianText = itTranslations["gallery.title"]; // Access as dictionary
    expect(italianText).toBe(expectedItalianText);
  });
  it("has consistent translation keys in both languages", () => {
    // Get all translation keys directly as they are already flat objects
    const italianKeys = Object.keys(itTranslations);
    const romanianKeys = Object.keys(roTranslations);
    // Check common keys that should exist in both languages
    const commonKeys = ["app.title", "gallery.title", "gallery.subtitle"];

    // Common keys should exist in both languages
    commonKeys.forEach((key) => {
      expect(italianKeys).toContain(key);
      expect(romanianKeys).toContain(key);
    });
  });
});
