- Blockchain nodes : - accept - reject and store data - Managing transactions and control validity

  Why use oppenzeppelin in our smart contract:

  - Your contract won't break unexpectedly when upgrading to newer versions
  - Simply importing to you solidity file

    - Access control oppenzeppelin : Define who allowed to do this thing
      Ownership ------------> Ownable
      Ownership : an account that is the owner of a contract and can do admin task in it
      In order to implement ownership use Ownable (the account that deploy the contract)

Token : 🌿

- We will use ERC721 as our token standard
  Important : :trollface:

  - \_setTokenURI() : store the item 's metadata

  Why use ERC721 in our smart contract instead of ERC20 ?
  in ERC20 just have basic mapping of an address and how much that address have

  - in ERC721, we have unique tokenId, each token have an unique owner
  - in ERC721, we have tokenURI which is a metadata (Returns the URI for a given token ID)

  Why we need to use tokenURI ?

  - when we transfer a massive data like NFT images on blockchain, it will cost a massive cost of gas fee
  - to get around this : they put token in an token standard called tokenURI
  - tokenURI is just a simple API call

  * example :
    {
    "name":"Name",
    "description":"DESCRIPTION",
    "image":"IMAGE"
    }

  So, what is metadata ?

  - A character in a game, we need that character stats
  - we need to define attributes of that object

  => metadata are born
  🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊

Ether.js 🙌
Ether.js provide + Provider : a class which provides an abstraction for connection to ethereum network, provide read-only access to Blockchain + Signer : a class which usually directly or indirectly has access to private key, which can sign message and transaction to authorize the network to change your account

Ability : 💭 + Using ethers, you can interact with smart_contract via ABI in ethers

🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊
Hardhat : 🤠

- when hardhat run, it searches for the closest hardhat.config.js file and based on this file, hardhat will help you
  test, compile and deploy your smart contract

JSON-RPC based network : - network connect external node (node can be ganache, localhost or remote like alchemy)
-Url : url of node - chainId : optional number, used to validate network you wanna deploy - from : account (hardhat provide for you 10 fake account with 100 ETH to run and deploy your smart contract)
= gas - accounts :

Hardhat network 💥

run yarn hardhat node or npx hardhat node to start local server
Compile : yarn hardhat compile -> started HTTP and JSON-RPC http://127.0.0.1:8545 \* After compile complete, hardhat generates artifacts and cache folders which contain all information about our smart contract

Testing : yarn hardhat test \* along with mocha and chai, we can apply assert and expect to test our smart contract

Deploy : yarn hardhat deploy

- write a deploy.js file
  // structure
  //import
  //async function
  // main function
  [ By using hardhat etherscan plugin@, help you to verify the source code via etherscan] => verify your contract before deploy
  You will need an ETHERSCAN_API_KEY

When running a project, you must split the terminal

- one run npx hardhat node
- one run scripts

connect your Dapps to hardhat network or local network : /_ npx hardhat run scripts/sample.js --network localhost _/

- Default network is hardhat network
- create our own network
  networks:{
  rinkeBy:{
  url:RINKEBY_RPC_URL,
  account: PRIVATE_KEY,
  chainId : 4 , // 4 is chainId of rinkeBy
  }
  }

  when finished deploy, you can interact with the contract (smart contract deploy will create a json file called ABI, we will use that ABI to interact with our scripts)

  🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊

                                            Onchain- Offchain store data

- when you store off chain, it will cheaper than store on chain (of course)

=> IPFS

# Moralis Query

Relational Queries
For example, if each Comment has a Post object in its post field, you can fetch comments for a particular Post:
// Assume Moralis.Object myPost was previously created.
const query = new Moralis.Query(Comment);
query.equalTo("post", myPost);
// comments now contains the comments for myPost
const comments = await query.find();

//In order to find comments for posts containing images, you can do:
const Post = Moralis.Object.extend("Post");
const Comment = Moralis.Object.extend("Comment");
const innerQuery = new Moralis.Query(Post);
innerQuery.exists("image");
const query = new Moralis.Query(Comment);
query.matchesQuery("post", innerQuery);
// comments now contains the comments for posts with images.
const comments = await query.find();
