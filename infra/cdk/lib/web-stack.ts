import { Stack, StackProps, CfnOutput, Tags } from 'aws-cdk-lib';
import { Construct } from 'constructs';

interface WebProps extends StackProps {
  stage: 'dev' | 'sbx' | 'prod';
  distributionOrigins: string[];
}

export class WebStack extends Stack {
  constructor(scope: Construct, id: string, props: WebProps) {
    super(scope, id, props);

    // Placeholder: In a full setup we could create Amplify app or CloudFront here.
    // For MVP infra wiring, just output intended API origin per stage.
    new CfnOutput(this, 'ApiOrigin', { value: props.distributionOrigins?.join(',') || 'n/a' });

    Tags.of(this).add('Stage', props.stage);
  }
}
