// LibP2PNode.ts
import { gossipsub } from "@chainsafe/libp2p-gossipsub";
import { noise } from "@chainsafe/libp2p-noise";
import { yamux } from "@chainsafe/libp2p-yamux";
import { identify } from "@libp2p/identify";
import { kadDHT } from "@libp2p/kad-dht";
import { mdns } from "@libp2p/mdns";
import { pubsubPeerDiscovery } from "@libp2p/pubsub-peer-discovery";
import { tcp } from "@libp2p/tcp";
import { webSockets } from "@libp2p/websockets";
import { provide } from "inversify-binding-decorators";
import { createLibp2p, Libp2p, Libp2pOptions } from "libp2p";

@provide(LibP2PNode)
export class LibP2PNode {
  private node: Libp2p | null = null;

  // Method to create and start the node
  public async startNode(port: string): Promise<Libp2p> {
    this.node = await this.createNode(port);
    await this.node.start();
    console.log(`Node started on port ${port}, Peer ID: ${this.node.peerId.toString()}`);
    this.logAddresses();
    this.addEventListeners(); // Add peer-related event listeners
    return this.node;
  }

  // Creates and configures the LibP2p instance
  private async createNode(port: string): Promise<Libp2p> {
    const options: Libp2pOptions = {
      addresses: { listen: [`/ip4/0.0.0.0/tcp/${port}`] },
      transports: [tcp(), webSockets()],
      connectionEncrypters: [noise()],
      streamMuxers: [yamux()],
      peerDiscovery: [
        pubsubPeerDiscovery({ interval: 1000 }),
        mdns({
          interval: 1000,
        }),
      ],

      services: {
        dht: kadDHT({ clientMode: false }), // Optional DHT for peer routing
        identify: identify(), // Required for peer identification
        pubsub: gossipsub(),
      },
    };

    return await createLibp2p(options);
  }

  // Logs the listening addresses of the node
  private logAddresses(): void {
    const addresses = this.node?.getMultiaddrs();
    if (addresses && addresses.length > 0) {
      console.log("Listening on the following addresses:");
      addresses.forEach((addr) => console.log("    ", addr.toString()));
    } else {
      console.log("No listening addresses found.");
    }
  }

  public logConnectedPeers(node: Libp2p): void {
    // @ts-ignore
    const connectedPeers = node?.peerStore.peers;
    if (connectedPeers && connectedPeers.size > 0) {
      console.log("Connected peers:");
      connectedPeers.forEach((peer) => {
        console.log(`- ${peer.id.toString()} (${peer.isConnected ? "connected" : "disconnected"})`);
      });
    } else {
      console.log("No connected peers found.");
    }
  }

  // Adds peer discovery and connection event listeners
  private addEventListeners(): void {
    this.node?.addEventListener("peer:discovery", async (evt) => {
      const discoveredPeerId = evt.detail.id;

      // Skip dialing if the discovered Peer ID is the same as this node's Peer ID
      if (discoveredPeerId.equals(this.node.peerId)) {
        return;
      }

      console.log(`💡Node ${this.node.peerId} discovered peer ${discoveredPeerId.toString()}`);
      try {
        await this.node.dial(discoveredPeerId);
        console.log(`> Connected to ${discoveredPeerId.toString()}`);
      } catch (err) {
        console.error(`Failed to connect to ${discoveredPeerId.toString()}:`, err);
      }
    });
  }
}
