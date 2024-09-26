// LibP2PMessaging.ts
import { provideSingleton } from "@providers/inversify/singleton";
import { Libp2p } from "libp2p";

@provideSingleton(LibP2PMessaging)
export class LibP2PMessaging {
  // Subscribe to a topic with a message handler
  public addEventListener(node: Libp2p, handler: (message: any) => void): void {
    (node.services.pubsub as any).addEventListener("message", (message) => {
      console.log(`${message.detail.topic}:`, new TextDecoder().decode(message.detail.data));
      handler(message);
    });
  }

  public subscribe(node: Libp2p, topic: string): void {
    (node.services.pubsub as any).subscribe(topic);
    console.log(`Node ${node.peerId.toString()} subscribed to topic: ${topic}`);
  }

  // Publish a message to a topic
  public publish(node: Libp2p, topic: string, message: any): void {
    console.log(`Node ${node.peerId.toString()} publishing message to topic: ${topic}`);
    const data = new TextEncoder().encode(JSON.stringify(message));
    (node.services.pubsub as any).publish(topic, data);
  }
}
