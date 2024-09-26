// LibP2PMessaging.ts
import { provideSingleton } from "@providers/inversify/singleton";
import { Libp2p } from "libp2p";

@provideSingleton(LibP2PMessaging)
export class LibP2PMessaging {
  // Subscribe to a topic with a message handler
  public addEventListener(node: Libp2p, handler: (message: any, from: string) => void): void {
    (node.services.pubsub as any).addEventListener("message", (event: any) => {
      const data = JSON.parse(event.detail.data.toString());
      const from = event.detail.from.toString();
      handler(data, from);
    });
  }

  public subscribe(node: Libp2p, topic: string): void {
    (node.services.pubsub as any).subscribe(topic);
  }

  // Publish an object to a topic
  public publish(node: Libp2p, topic: string, message: any): void {
    const messageBuffer = Buffer.from(JSON.stringify(message));
    (node.services.pubsub as any).publish(topic, messageBuffer);
  }
}
