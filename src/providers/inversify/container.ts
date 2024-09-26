import { LibP2PMessaging } from "@providers/libp2p/LibP2PMessaging";
import { LibP2PNode } from "@providers/libp2p/LibP2PNode";
import { Container } from "inversify";
import { buildProviderModule } from "inversify-binding-decorators";
import { ServerHelper } from "../server/ServerHelper";
import { controllersContainer } from "./ControllersInversify";

const container = new Container();

container.load(controllersContainer, buildProviderModule());

export const serverHelper = container.get<ServerHelper>(ServerHelper);

export const libP2PNode = container.get<LibP2PNode>(LibP2PNode);
export const libP2PMessaging = container.get<LibP2PMessaging>(LibP2PMessaging);

export { container };
