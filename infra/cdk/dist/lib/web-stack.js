"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebStack = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
class WebStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // Placeholder: In a full setup we could create Amplify app or CloudFront here.
        // For MVP infra wiring, just output intended API origin per stage.
        new aws_cdk_lib_1.CfnOutput(this, 'ApiOrigin', { value: props.distributionOrigins.join(',') || 'n/a' });
        aws_cdk_lib_1.Tags.of(this).add('Stage', props.stage);
    }
}
exports.WebStack = WebStack;
