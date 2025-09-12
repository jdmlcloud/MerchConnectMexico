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
};
export const PlanNameSchema = PlanKeySchema;
export function hasFeature(planName, feature) {
    const plan = plans[planName];
    return Boolean(plan[feature]);
}
