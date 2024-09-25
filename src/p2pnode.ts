import "reflect-metadata"; //! THIS IMPORT MUST ALWAYS COME FIRST. BEWARE VSCODE AUTO IMPORT SORT!!!

import "dotenv/config";

import { libP2PNode } from "@providers/inversify/container";

await libP2PNode.createNode();
