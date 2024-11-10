import { z } from "zod";

export const onboardingFormSchema = z.object({
  name: z.string().min(2).max(50),
  type: z.string().min(2).max(50),
  tenantName: z.string().min(2).max(50),
  step: z.number().min(0).max(2),
});
