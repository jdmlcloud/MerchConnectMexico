"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentityStack = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_cognito_1 = require("aws-cdk-lib/aws-cognito");
class IdentityStack extends aws_cdk_lib_1.Stack {
    userPool;
    userPoolClient;
    constructor(scope, id, props) {
        super(scope, id, props);
        const userPool = new aws_cognito_1.UserPool(this, 'UserPool', {
            userPoolName: `mc-${props.stage}-users`,
            selfSignUpEnabled: true,
            signInAliases: { email: true },
            accountRecovery: aws_cognito_1.AccountRecovery.EMAIL_ONLY,
            mfa: undefined,
        });
        aws_cdk_lib_1.Tags.of(userPool).add('Stage', props.stage);
        const userPoolClient = userPool.addClient('web', {
            userPoolClientName: `mc-${props.stage}-web-client`,
            generateSecret: false,
            oAuth: {
                scopes: [aws_cognito_1.OAuthScope.OPENID, aws_cognito_1.OAuthScope.EMAIL, aws_cognito_1.OAuthScope.PROFILE],
            },
            authFlows: { userPassword: true, userSrp: true },
        });
        this.userPool = userPool;
        this.userPoolClient = userPoolClient;
    }
}
exports.IdentityStack = IdentityStack;
