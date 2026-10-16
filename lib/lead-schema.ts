import { z } from "zod";

export const normalizePeruvianPhone = (raw: string): string | null => {
  const compact = raw.replace(/[\s()\-]/g, "");
  const digits = compact.startsWith("+51")
    ? compact.slice(3)
    : compact.startsWith("51") && compact.length === 11
      ? compact.slice(2)
      : compact;
  return /^9\d{8}$/.test(digits) ? `+51${digits}` : null;
};

export const leadSchema = z.object({
  fullName: z.string().trim().min(3).max(120),
  phone: z.string().trim().min(9).max(25),
  email: z.union([z.literal(""), z.email().max(254)]).optional().default(""),
  consent: z.literal(true),
  campaignSource: z.string().trim().min(1).max(120),
  submissionToken: z.uuid(),
  turnstileToken: z.string().max(4096).optional().default(""),
  website: z.string().max(200).optional().default(""),
});

export type LeadPayload = z.infer<typeof leadSchema>;

export function cleanCampaignSource(value: string | null): string {
  return (value || "landing-organica")
    .slice(0, 120)
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .replace(/-+/g, "-") || "landing-organica";
}
