import { NextRequest, NextResponse } from 'next/server';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

export async function POST(req: NextRequest, { params }: { params: { orgId: string; slug: string } }) {
  const stage = process.env.NEXT_PUBLIC_STAGE as 'dev' | 'sbx' | 'prod';
  const queueUrl = `https://sqs.${process.env.AWS_REGION ?? 'us-east-1'}.amazonaws.com/${process.env.AWS_ACCOUNT_ID ?? 'TODO_ACCOUNT_ID'}/mc-${stage}-pages-publish`;
  const body = await req.json();
  const html = body?.html ?? '<html><body>empty</body></html>';
  const client = new SQSClient({ region: process.env.AWS_REGION ?? 'us-east-1' });
  await client.send(new SendMessageCommand({
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify({ orgId: params.orgId, slug: params.slug, html }),
  }));
  return NextResponse.json({ ok: true });
}
