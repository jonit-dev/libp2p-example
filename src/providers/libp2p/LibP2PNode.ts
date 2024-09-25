import { mplex } from "@libp2p/mplex";
import { tcp } from "@libp2p/tcp";
import { webSockets } from "@libp2p/websockets";
import { provide } from "inversify-binding-decorators";
import { createLibp2p, Libp2p } from "libp2p";

import { noise } from "@chainsafe/libp2p-noise";

@provide(LibP2PNode)
export class LibP2PNode {
  public async createNode(): Promise<Libp2p> {
    const node = await createLibp2p({
      transports: [tcp(), webSockets()],
      connectionEncrypters: [noise()],
      streamMuxers: [mplex()],
    });

    await node.start();
    console.log("libp2p node has started");

    // Log the node's addresses
    console.log("Node addresses:");
    node.getMultiaddrs().forEach((addr) => {
      console.log(addr.toString());
    });

    return node;
  }
}
