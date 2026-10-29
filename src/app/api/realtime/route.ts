import { REALTIME_INCOMING_ITEMS } from "@/services/mockData";

export async function GET() {
  const encoder = new TextEncoder();

  // Server-Sent Events stream
  const customReadable = new ReadableStream({
    start(controller) {
      let index = 0;

      // Send initial handshake
      controller.enqueue(
        encoder.encode(`event: connected\ndata: ${JSON.stringify({ status: "connected", timestamp: Date.now() })}\n\n`)
      );

      // Periodically push live events
      const interval = setInterval(() => {
        if (index < REALTIME_INCOMING_ITEMS.length) {
          const item = {
            ...REALTIME_INCOMING_ITEMS[index],
            id: `realtime-${Date.now()}-${index}`,
            publishedAt: new Date().toISOString(),
          };
          controller.enqueue(
            encoder.encode(`event: new_content\ndata: ${JSON.stringify(item)}\n\n`)
          );
          index++;
        } else {
          // Send heartbeat ping
          controller.enqueue(encoder.encode(`: ping\n\n`));
        }
      }, 15000); // every 15s

      // Close stream after 5 minutes or if aborted
      setTimeout(() => {
        clearInterval(interval);
        try {
          controller.close();
        } catch {}
      }, 300000);
    },
  });

  return new Response(customReadable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
