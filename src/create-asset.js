const algosdk = require('algosdk');
const crypto = require('crypto');
const fs = require('fs');

const config = require('../config.json')

async function createAsset(algodClient, account) {
    const feePerByte = 10;
    const firstValidRound = 22289903;
    const lastValidRound = 22290903;
    const genesisHash = 'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=';

    const total = 1000000000000000; // how many of this asset there will be
    const decimals = 6; // units of this asset are whole-integer amounts
    const assetName = 'Mialgo';
    const unitName = 'MIALGO';
    const url = 'mialgo.io';
    // const metadata = new Uint8Array(
    //     Buffer.from(
    //         '664143504f346e52674f35356a316e64414b3357365367633441506b63794668',
    //         'hex'
    //     )
    // ); // should be a 32-byte hash
    const defaultFrozen = false; // whether accounts should be frozen by default

    const suggestedParams = {
        flatFee: false,
        fee: feePerByte,
        firstRound: firstValidRound,
        lastRound: lastValidRound,
        genesisHash,
        genesisID: "testnet-v1.0"
    };

    const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
        from: account.addr,
        total,
        decimals,
        assetName,
        unitName,
        assetURL: url,
        assetMetadataHash: '',
        defaultFrozen,
    
        freeze: account.addr,
        manager: account.addr,
        clawback: account.addr,
        reserve: account.addr,
    
        suggestedParams,
    });

    // sign the transaction
    const signedTxn = txn.signTxn(account.sk);
    
    let sendTx = await algodClient.sendRawTransaction(signedTxn).do();

    let assetID = null;
    // wait for transaction to be confirmed
    const ptx = await algosdk.waitForConfirmation(algodClient, sendTx.txId, 4);
    // Get the new asset's information from the creator account
    assetID = ptx["asset-index"];
    //Get the completed Transaction
    console.log("Transaction " + sendTx.txId + " confirmed in round " + ptx["confirmed-round"]);

    return {
        assetID
    }


}

async function firstFT() {
    try {
        // let account = createAccount();
        // console.log("Press any key when the account is funded");
        // await keypress();

        secretKey = algosdk.mnemonicToSecretKey(config.mnemonic)

        const account = {
            addr: `STRA24PIDCBJIWPSH7QEBM4WWUQU36WVGCEPAKOLZ6YK7IVLWPGL6AN6RU`,
            sk: secretKey.sk
        }

        const algodToken = {
            'X-API-Key': config['X-API_Key']
        }
        const algodServer = 'https://testnet-algorand.api.purestake.io/ps2'
        const algodPort = 443;

        let algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

        // CREATE ASSET
        const { assetID } = await createAsset(algodClient, account);
        
        console.log('assetID', assetID)
        
        // DESTROY ASSET
        // await destroyAsset(algodClient, account, assetID); 
         // CLOSEOUT ALGOS - Account closes out Alogs to dispenser
        // await closeoutAccountAlgos(algodClient, account);
    }
    catch (err) {
        console.log("err", err);
    }
    process.exit();
};


firstFT();