import { describe, expect, it } from "vitest";
import { calculateFlavorRadarData, getSmartAlerts, getTargetLockSuggestion } from "@/domain/blendEngine";

describe("blendEngine", () => {
  it("suggests target lock grams using rounding", () => {
    const result = getTargetLockSuggestion({
      ingredients: [{ ingredientId: "acem", percentage: 100 }],
      extras: [],
      burgerCount: 1,
      burgerWeight: 1000,
      target: 22,
      roundingStep: 10,
      fatSourceId: "gordura-bovina",
    });

    expect(result.status).toBe("ok");
    expect(result.suggestedGrams).toBe(60);
    expect(result.recommendation).toContain("22%");
  });

  it("warns when fat source cannot reach target", () => {
    const result = getTargetLockSuggestion({
      ingredients: [{ ingredientId: "acem", percentage: 100 }],
      extras: [],
      burgerCount: 1,
      burgerWeight: 1000,
      target: 22,
      roundingStep: 10,
      fatSourceId: "acem",
    });

    expect(result.status).toBe("warning");
    expect(result.warning).toMatch(/nao corrige/);
  });

  it("warns when target already exceeded", () => {
    const result = getTargetLockSuggestion({
      ingredients: [{ ingredientId: "gordura-bovina", percentage: 100 }],
      extras: [],
      burgerCount: 1,
      burgerWeight: 1000,
      target: 20,
      roundingStep: 10,
      fatSourceId: "gordura-bovina",
    });

    expect(result.status).toBe("warning");
    expect(result.warning).toMatch(/passou do alvo/);
  });

  it("returns smart alerts for coxao and flare-ups", () => {
    const alerts = getSmartAlerts(
      [{ ingredientId: "coxao-duro", percentage: 50 }],
      18,
      "Churrasqueira",
      "Gourmet",
    );
    const ids = alerts.map((alert) => alert.id);
    expect(ids).toContain("coxao-dominant");
  });

  it("flags high fat and flare-ups on grelha", () => {
    const alerts = getSmartAlerts(
      [{ ingredientId: "acem", percentage: 100 }],
      31,
      "Grelha",
      "Gourmet",
    );
    const ids = alerts.map((alert) => alert.id);
    expect(ids).toContain("high-fat");
    expect(ids).toContain("flare-ups");
  });

  it("adds alerts for smash and airfryer profiles", () => {
    const smashAlerts = getSmartAlerts(
      [{ ingredientId: "acem", percentage: 100 }],
      18,
      "Airfryer",
      "Smash",
    );
    const smashIds = smashAlerts.map((alert) => alert.id);
    expect(smashIds).toContain("smash-low-fat");

    const airfryerAlerts = getSmartAlerts(
      [{ ingredientId: "acem", percentage: 100 }],
      28,
      "Airfryer",
      "Gourmet",
    );
    const airfryerIds = airfryerAlerts.map((alert) => alert.id);
    expect(airfryerIds).toContain("airfryer-high-fat");
  });

  it("builds flavor radar data within 1-5 range", () => {
    const data = calculateFlavorRadarData(
      [{ ingredientId: "acem", percentage: 70 }],
      [{ ingredientId: "queijo", grams: 30 }],
      1,
      100,
    );
    expect(data).toHaveLength(6);
    data.forEach((item) => {
      expect(item.value).toBeGreaterThanOrEqual(1);
      expect(item.value).toBeLessThanOrEqual(5);
    });
  });
});
