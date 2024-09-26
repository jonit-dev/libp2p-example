// main.ts
import "reflect-metadata"; //! THIS IMPORT MUST ALWAYS COME FIRST. BEWARE VSCODE AUTO IMPORT SORT!!!

import { libP2PMessaging, libP2PNode } from "@providers/inversify/container";
import "dotenv/config";

// Start node 1 on port 8000
const node1 = await libP2PNode.startNode("8000");

// Start node 2 on port 8001
const node2 = await libP2PNode.startNode("8001");

// Wait a bit to allow nodes to discover each other via mDNS
console.log("Waiting for nodes to discover each other...");
await new Promise((resolve) => setTimeout(resolve, 2000));

libP2PMessaging.addEventListener(node1, (message, from) => {
  console.log(`Node1 received message from ${from}:`, message);
});

libP2PMessaging.addEventListener(node2, (message, from) => {
  console.log(`Node2 received message from ${from}:`, message);
});

// Subscribe to the "chat" topic on node1
await libP2PMessaging.subscribe(node1, "chat");

// Subscribe to the "chat" topic on node2
await libP2PMessaging.subscribe(node2, "chat");

console.log("Preparing to publish message...");
// wait 2 seconds
await new Promise((resolve) => setTimeout(resolve, 2000));

// lets publish a message to the chat topic
libP2PMessaging.publish(node1, "chat", {
  message: "Hello from node 1",
});
