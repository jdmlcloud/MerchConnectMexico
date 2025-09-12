import { z } from 'zod';
import { PlanKeySchema } from '@merchconnect/types';

export const plans = {
  free: {
    rfqsLimit: 5,
    landingEditable: false,
    seoControls: false,
    whatsappIntegration: false,
    inventoryLimit: 100,
  },
  pro: {
    rfqsLimit: 50,
    landingEditable: true,
    seoControls: true,
    whatsappIntegration: true,
    inventoryLimit: Infinity,
  },
  premium: {
    rfqsLimit: Infinity,
    landingEditable: true,
    seoControls: true,
    whatsappIntegration: true,
    inventoryLimit: Infinity,
    prioritySupport: true,
  },
} as const;

export type Plans = typeof plans;
export type PlanName = keyof Plans;

export const PlanNameSchema = PlanKeySchema;

export function hasFeature(planName: PlanName, feature: keyof Plans['pro']) {
  const plan = plans[planName];
  return Boolean((plan as any)[feature]);
}
