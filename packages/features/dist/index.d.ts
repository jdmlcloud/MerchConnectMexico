import { z } from 'zod';
export declare const plans: {
    readonly free: {
        readonly rfqsLimit: 5;
        readonly landingEditable: false;
        readonly seoControls: false;
        readonly whatsappIntegration: false;
        readonly inventoryLimit: 100;
    };
    readonly pro: {
        readonly rfqsLimit: 50;
        readonly landingEditable: true;
        readonly seoControls: true;
        readonly whatsappIntegration: true;
        readonly inventoryLimit: number;
    };
    readonly premium: {
        readonly rfqsLimit: number;
        readonly landingEditable: true;
        readonly seoControls: true;
        readonly whatsappIntegration: true;
        readonly inventoryLimit: number;
        readonly prioritySupport: true;
    };
};
export type Plans = typeof plans;
export type PlanName = keyof Plans;
export declare const PlanNameSchema: z.ZodEnum<["free", "pro", "premium"]>;
export declare function hasFeature(planName: PlanName, feature: keyof Plans['pro']): boolean;
