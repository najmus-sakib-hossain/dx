import { NextResponse } from "next/server";

export const runtime = "edge";

export interface ChatMessagePayload {
  username: string;
  content: string;
  room?: string;
}

/**
 * POST /api/chat — Send a chat message
 *
 * This is a placeholder endpoint. In production, this would
 * integrate with a WebSocket server (Socket.IO / Partykit)
 * for real-time message delivery.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatMessagePayload;

    if (!body.username?.trim() || !body.content?.trim()) {
      return NextResponse.json(
        { error: "username and content are required" },
        { status: 400 }
      );
    }

    if (body.content.length > 500) {
      return NextResponse.json(
        { error: "Message must be under 500 characters" },
        { status: 400 }
      );
    }

    const message = {
      id: crypto.randomUUID(),
      username: body.username.trim(),
      content: body.content.trim(),
      room: body.room ?? "general",
      timestamp: Date.now(),
    };

    // TODO: Broadcast via WebSocket / Partykit
    // For now, just acknowledge receipt
    return NextResponse.json({ ok: true, message }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

/** GET /api/chat — Retrieve recent messages (placeholder) */
export async function GET() {
  // TODO: Fetch from persistent store (Redis / Drizzle)
  return NextResponse.json({
    messages: [],
    room: "general",
  });
}
