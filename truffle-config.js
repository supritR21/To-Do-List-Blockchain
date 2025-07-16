module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",  // Local Ganache host
      port: 7545,         // Ganache RPC port (as per your screenshot)
      network_id: "*",    // Match any network id
    },
  },
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
