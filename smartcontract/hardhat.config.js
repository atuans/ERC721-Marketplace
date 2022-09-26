require("@nomicfoundation/hardhat-toolbox");

require("dotenv").config()
/** @type import('hardhat/config').HardhatUserConfig */

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || ""
const RINKEBY_RPC_URL =process.env.RINKEBY_RPC_URL || "https://eth-rinkeby.alchemyapi.io/v2/fN9IEnzj-HuFsnfpG2PSpjJJC6a-MoO1"
const PRIVATE_KEY = process.env.PRIVATE_KEY || ""
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ""
const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL 
const ROPSTEN_PRIVATE_KEY = '15df763a3a641d9272f98bf92ca033402aa17a47d8294152e0142ff2aa5a55e1'
const ROPSTEN_RPC_URL ='https://eth-ropsten.alchemyapi.io/v2/Agwv6OI0nO5rHs_Euj7e8wUEod1U0y6J'
const GOERLI_PRIVATE_KEY='15df763a3a641d9272f98bf92ca033402aa17a47d8294152e0142ff2aa5a55e1'

const GOERLI_RPC_URL ='https://eth-goerli.g.alchemy.com/v2/xt602Kw7kPeFL-tSbhIPbNcHgvlsDA8N'
module.exports = {
    defaultNetwork: "hardhat",        

    networks: {
        hardhat: {
            chainId: 1337,
            // on a test network, we dont need to define an accounts (20 fake accounts auto generated when you in a local hardhat network)
        },
        rinkeby: {
            url: RINKEBY_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 4,
         },

         ropsten:{
            url: ROPSTEN_RPC_URL,
            accounts:[ROPSTEN_PRIVATE_KEY],
            
         },
         goerli:{
            url: GOERLI_RPC_URL,
            accounts:[GOERLI_PRIVATE_KEY],
            gas: 2100000,
            gasPrice: 8000000000,
         }        
    },
    solidity: {
        compilers: [
            {
                version: "0.8.8",
            },
        ],
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    gasReporter: {
        enabled: true,
        currency: "USD",
        outputFile: "gas-report.txt",
        noColors: true,
        // coinmarketcap: COINMARKETCAP_API_KEY,
    },
    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
            1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
        },
    },
    mocha: {
        timeout: 200000, // 200 seconds max for running tests
    },

}
