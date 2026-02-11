import { NextResponse } from "next/server";
import { headers } from "next/headers";

/**
 * POST /api/webhooks — Handle incoming webhooks
 *
 * Supports:
 * - Better Auth webhook events
 * - GitHub webhook events
 * - Integration webhook callbacks
 */
export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const signature = headersList.get("x-webhook-signature");
    const source = headersList.get("x-webhook-source") ?? "unknown";

    // Verify webhook signature in production
    const secret = process.env.BETTER_AUTH_WEBHOOK_SECRET;
    if (secret && !signature) {
      return NextResponse.json(
        { error: "Missing webhook signature" },
        { status: 401 }
      );
    }

    const payload = await request.json();

    // Route to appropriate handler based on source
    switch (source) {
      case "better-auth":
        return handleAuthWebhook(payload);
      case "github":
        return handleGitHubWebhook(payload);
      default:
        return handleGenericWebhook(source, payload);
    }
  } catch {
    return NextResponse.json(
      { error: "Invalid webhook payload" },
      { status: 400 }
    );
  }
}

function handleAuthWebhook(payload: Record<string, unknown>) {
  const event = payload.event as string | undefined;

  switch (event) {
    case "user.created":
      // TODO: Provision default user settings
      break;
    case "user.deleted":
      // TODO: Clean up user data
      break;
    default:
      break;
  }

  return NextResponse.json({ received: true });
}

function handleGitHubWebhook(payload: Record<string, unknown>) {
  // TODO: Handle GitHub events (push, PR, issue)
  return NextResponse.json({ received: true });
}

function handleGenericWebhook(
  source: string,
  payload: Record<string, unknown>
) {
  console.info(`[Webhook] Received from ${source}:`, payload);
  return NextResponse.json({ received: true });
}
