import { yamux } from "@chainsafe/libp2p-yamux";

import { tcp } from "@libp2p/tcp";
import { webSockets } from "@libp2p/websockets";
import { provide } from "inversify-binding-decorators";
import { createLibp2p, Libp2p } from "libp2p";

import { noise } from "@chainsafe/libp2p-noise";

@provide(LibP2PNode)
export class LibP2PNode {
  public async createNode(): Promise<Libp2p> {
    const node = await createLibp2p({
      addresses: {
        listen: ["/ip4/127.0.0.1/tcp/8000/ws"],
      },
      transports: [webSockets(), tcp()],
      connectionEncrypters: [noise()],
      streamMuxers: [yamux()],
    });

    await node.start();
    console.log("libp2p node has started");

    const addresses = node.getMultiaddrs();

    if (addresses.length > 0) {
      addresses.forEach((addr) => {
        console.log(addr.toString());
      });
    } else {
      console.log("No addresses found.");
    }

    return node;
  }
}
