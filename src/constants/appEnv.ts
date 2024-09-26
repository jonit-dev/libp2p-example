export const appEnv = {
  general: {
    env: process.env.ENV,
    apiURL: process.env.API_URL,
  },
  libp2p: {
    bootstrapNodes: process.env.LIBP2P_BOOTSTRAP_NODES,
  },
};
