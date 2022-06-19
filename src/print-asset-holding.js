const algosdk = require("algosdk");
const crypto = require("crypto");
const fs = require("fs");

const config = require("../config.json");

// Function used to print asset holding for account and assetid
const printAssetHolding = async function (algodClient, account, assetid) {
  console.log("printAssetHolding");

  // note: if you have an indexer instance available it is easier to just use this
  //   let accountInfo = await indexerClient
  //     .searchAccounts()
  //     .assetID(assetIndex)
  //     .do();

  console.log("accountInfo");

  // and in the loop below use this to extract the asset for a particular account
  // accountInfo['accounts'][idx][account]);

  console.log("HARSH_v_v_ _v_v_ _v_v_", account);
  console.log("HARSH_v_v_ _v_v_ _v_v_", assetid);

  let accountInfo;
  try {
    accountInfo = await algodClient.accountInformation(account).do();
    console.log("--- --- ---", accountInfo);
  } catch (e) {
    console.log("e", e);
  }

  console.log("_^_^_ _^_^_ _^_^_");
  console.log(accountInfo);

  let holdsMialgo = false;
  for (idx = 0; idx < accountInfo["assets"].length; idx++) {
    let scrutinizedAsset = accountInfo["assets"][idx];
    if (scrutinizedAsset["asset-id"] == assetid) {
      let myassetholding = JSON.stringify(scrutinizedAsset, undefined, 2);
      console.log("assetholdinginfo = " + myassetholding);
      holdsMialgo = true;
      break;
    }
  }

  return holdsMialgo;
};

async function main() {
  try {
    // secretKey = algosdk.mnemonicToSecretKey(config.mnemonic);
    // const account = {
    //   addr: `STRA24PIDCBJIWPSH7QEBM4WWUQU36WVGCEPAKOLZ6YK7IVLWPGL6AN6RU`,
    //   sk: secretKey.sk,
    // };

    const algodToken = {
      "X-API-Key": config["X-API_Key"],
    };
    const algodServer = "https://testnet-algorand.api.purestake.io/ps2";
    const algodPort = 443;

    let algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

    const testAccount1 =
      "STRA24PIDCBJIWPSH7QEBM4WWUQU36WVGCEPAKOLZ6YK7IVLWPGL6AN6RU";
    const testAccount2 =
      "M3EPGFRLNMM5H6PADZBALFLMOPITYVPPZZM5VQYXV7REMJFVO2APGLMXLQ";
    const testAccount3 =
      "CMC7AD2G4MXIN46LBMP6WOO5O4SA3RVBWYNMPIHPMUDYKNYE4XS2Y3BOIM";

    const assetId = 95939489;

    // CREATE ASSET
    const res = await printAssetHolding(algodClient, testAccount1, assetId);

    console.log("res", res);
  } catch (err) {
    console.log("err", err);
  }
  process.exit();
}

main();
