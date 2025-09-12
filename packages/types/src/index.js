"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.zod = exports.PaginationSchema = exports.FeatureKeySchema = exports.AuthClaimsSchema = exports.OrgTypeSchema = exports.PlanKeySchema = exports.StageSchema = void 0;
const zod_1 = require("zod");
exports.StageSchema = zod_1.z.enum(['dev', 'sbx', 'prod']);
exports.PlanKeySchema = zod_1.z.enum(['free', 'pro', 'premium']);
exports.OrgTypeSchema = zod_1.z.enum(['workshop', 'provider']);
exports.AuthClaimsSchema = zod_1.z.object({
    stage: exports.StageSchema,
    orgId: zod_1.z.string().min(1),
    orgType: exports.OrgTypeSchema,
    plan: exports.PlanKeySchema,
    features: zod_1.z.array(zod_1.z.string()).default([]),
    roles: zod_1.z.array(zod_1.z.string()).default([]),
    perms: zod_1.z.array(zod_1.z.string()).default([])
});
exports.FeatureKeySchema = zod_1.z.enum([
    'landingEditable',
    'seoControls',
    'whatsappIntegration',
    'prioritySupport'
]);
exports.PaginationSchema = zod_1.z.object({
    limit: zod_1.z.number().int().positive().max(100).default(20),
    cursor: zod_1.z.string().optional()
});
__exportStar(require("./features.js"), exports);
exports.zod = __importStar(require("zod"));
