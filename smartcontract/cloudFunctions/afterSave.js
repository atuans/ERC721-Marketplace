32// before a Item is saved, we trigger => modify things in ItemForSales table and using it to List
// Using Moralis "trigger" berforeSaveS

Moralis.Cloud.beforeSave("ItemForSales",async(request) =>{
    const confirmed = request.object.get('confirmed');
    const logger = Moralis.Cloud.getLogger();
    logger.info('Ready for putting Item on Sale');

    if(confirmed){
        logger.info('Found Item');
        const ItemForSales = Moralis.Object.extend('ItemForSales');

        const query = new Moralis.Query(ItemForSales);
        query.equalTo('nftAddress', request.object.get('nftAddress'));
        query.equalTo('tokenId', request.object.get('tokenId'));

        logger.info(`Marketplace | Query: ${query}`);

        const item = new ItemForSales();
        item.set('tokenURI',request.object.get('tokenURI'));
        item.set('seller', request.object.get('seller'));

        logger.info('Added');
        await item.save();
    }
})

Moralis.Cloud.beforeSave('ItemSold', async(request)=>{
    const query = new Moralis.Query('ItemForSales');
    query.equalTo('uid',request.object.get('uid')); // id from each event called   event ItemSold(uint256 id, address buyer, uint256 price);

    const item = await query.first();
    if(item){
        request.object.set('item',item);
        item.set('iSold',true);
        await item.save();

        const userQuery = new Moralis.Query(Moralis.User);
        userQuery.equalTo('account', request.object.set('buyer'));
        const userObject = await userQuery.first({useMasterKey:true}); 

        if(userObject){
            request.object.set('user', userObject); // create new column
        }
    }
})


Moralis.Cloud.define('getItems', async(request)=>{
    const logger = Moralis.Cloud.getLogger();
    logger.info('Getting Item for sale .............')
    const query = new Moralis.Query('ItemForSales');
    query.notEqualTo('isSold',true);
    if(request.user){
        query.notContainedIn('token.seller',request.user.attributes.accounts); // the user will contain attributes

    }
    query.select("uid","nftAddress","tokenId","price","token.tokenURI","token.seller","user.username","user.ethAddress"); // select specific column
    const Queryresults = await query.find({useMasterKey:true});
    const results = [];

    for (let i = 0; i < Queryresults.length; ++i) {
        if(!Queryresults[i].attributes.token || !Queryresults[i].attributes.user) continue;
        results.push({
            "uid": Queryresults[i].attributes.uid,
            "tokenId": Queryresults[i].attributes.tokenId,
            "nftAddress": Queryresults[i].attributes.nftAddress,
            "tokenURI": Queryresults[i].attributes.token.attributes.src,
            "owner_of":Queryresults[i].attributes.token.attributes.seller,
            "sellerUsername":Queryresults[i].attributes.user.attributes.username,
            "sellerEthAddress":Queryresults[i].attributes.user.ethAddress,
        })
  }
  return results;

})