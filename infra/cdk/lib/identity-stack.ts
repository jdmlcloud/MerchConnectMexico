import { Stack, StackProps, Tags } from 'aws-cdk-lib';
import { UserPool, AccountRecovery, UserPoolClient, OAuthScope } from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

interface StageProps extends StackProps {
  stage: 'dev' | 'sbx' | 'prod';
}

export class IdentityStack extends Stack {
  public readonly userPool: UserPool;
  public readonly userPoolClient: UserPoolClient;

  constructor(scope: Construct, id: string, props: StageProps) {
    super(scope, id, props);

    const userPool = new UserPool(this, 'UserPool', {
      userPoolName: `mc-${props.stage}-users`,
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      accountRecovery: AccountRecovery.EMAIL_ONLY,
      mfa: undefined,
    });
    Tags.of(userPool).add('Stage', props.stage);

    const userPoolClient = userPool.addClient('web', {
      userPoolClientName: `mc-${props.stage}-web-client`,
      generateSecret: false,
      oAuth: {
        scopes: [OAuthScope.OPENID, OAuthScope.EMAIL, OAuthScope.PROFILE],
      },
      authFlows: { userPassword: true, userSrp: true },
    });

    this.userPool = userPool;
    this.userPoolClient = userPoolClient;
  }
}
