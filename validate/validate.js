// Address of the AGLDToken Implementation
var AGLDTokenAddress = "0xGETUPONDEPLOYMENT";

// Address of the AGLDToken Proxy
var AGLDTokenProxyAddress = "0xGETUPONDEPLOYMENT";

// role addresses
var MASTER_MINTER = "0x6e75254a743f334254e422f3329EBbD12AA159A5";
var PAUSER = "0x495cb0Dcc4f5CdC06e53B0EC9371E1DC4aD82c67";
var UPGRADER = "0x389cF740D1F2E0934BEab61cba55aa8ced5E53F7";
var OWNER = "0x577667F670C0CFe366A124A478b2cf84236Af010";
var BLACKLISTER = "0x08B187e6733042E0cDFcC9885517D0DF39e7311B";

// Addresses of known minters - currently fake minters
// If replacing with real minters need to modify printMinterInfo
var minters = ["0x0000", "0x0001"];

var NAME = "AnthemGold";
var SYMBOL = "AGLD";
var CURRENCY = "AGLD";
var DECIMALS = 9 ;
var TOTALSUPPLY =  0;
var PAUSED = false

// Name of current implementation artifact as stored in ./build/contracts/*.json
var AGLDToken = artifacts.require("AGLDTokenV1");

// Name of current proxy artifact as stored in ./build/contracts/*.json
var AGLDTokenProxy = artifacts.require("AGLDTokenProxy");

//
//
// Validation code
//
//

var adminSlot = "0x10d6a54a4754c8869d6886b5f5d7fbfa5b4522237ea5c60d11bc4e7a1ff9390b";
var implSlot = "0x7050c9e0f4ca769c69bd3a8ef740bc37934f8e2c036e5a723fd8ee048ed3f8c3";

const asyncGetStorageAt = (address, slot) => new Promise((resolve, reject) => {
  web3.eth.getStorageAt(address, slot, (err, result) => {
    if (err) {
      return reject(err);
    }
    resolve(result);
  });
});

async function printMinterInfo(proxiedToken) {
    for (const minter of minters) {
        console.log("\nMinter: " + minter);

        let isMinter = await proxiedToken.isMinter.call(minter);
        print("isMinter", isMinter, false);

        let minterAllowance = await proxiedToken.minterAllowance.call(minter);
        print("mintAllowance", minterAllowance, 0);

        let balanceOf = await proxiedToken.balanceOf.call(minter);
        print("balanceOf", balanceOf, 0);

        let isBlacklisted = await proxiedToken.isBlacklisted.call(minter);
        print("isBlacklisted", isBlacklisted, false);
    }
}

function getAddressFromSlotData(slotData) {
    const rawAddress = slotData.substring(26, 86);
    return "0x" + rawAddress;
}

function compare(actual, expected) {
    if(actual == expected)
    {
        return "(ok)";
    } else {
        return "(expect " + expected + ")";
    }
}

function print(name, actual, expected) {
    console.log(name + "\t" + actual + "\t" + compare(actual, expected));
}

async function Validate() {
    console.log("Connecting to contract...");
    var token = await AGLDToken.at(agldTokenAddress);
    console.log("Token found.");
    var proxiedToken = await AGLDToken.at(agldTokenProxyAddress);
    console.log("Proxied token created.");

    // initialized needs to retrieved manually
    var slot8Data = await asyncGetStorageAt(proxiedToken.address, 8);
    var initialized = slot8Data.substring(24,26);
    print("init proxy", initialized, "01");

    var slot8Data = await asyncGetStorageAt(agldTokenAddress, 8);
    var initialized = slot8Data.substring(24,26);
    print("init logic", initialized, "01");

    var name = await proxiedToken.name.call();
    print("name     ", name, NAME);

    var symbol = await proxiedToken.symbol.call();
    print("symbol   ", symbol, SYMBOL);

    var decimals = await proxiedToken.decimals.call();
    print("decimals", decimals, DECIMALS);

    var currency = await proxiedToken.currency.call();
    print("currency", currency, CURRENCY);

    var totalSupply = await proxiedToken.totalSupply.call();
    print("totalSupply", totalSupply, TOTALSUPPLY);

    var paused = await proxiedToken.paused.call();
    print("paused  ", paused, PAUSED);

    // implementation
    var implementation = await asyncGetStorageAt(proxiedToken.address, implSlot);
    print("implement", getAddressFromSlotData(implementation), agldTokenAddress);

    var admin = await asyncGetStorageAt(proxiedToken.address, adminSlot);
    print("upgrader", getAddressFromSlotData(admin), UPGRADER);

    var owner = await proxiedToken.owner.call();
    print("owner   ", owner, OWNER);

    var masterMinter = await proxiedToken.masterMinter.call();
    print("masterMinter", masterMinter, MASTER_MINTER);

    var pauser = await proxiedToken.pauser.call();
    print("pauser  ", pauser, PAUSER);

    var blacklister = await proxiedToken.blacklister.call();
    print("blacklister", blacklister, BLACKLISTER);

    await printMinterInfo(proxiedToken);
}

module.exports = async function(callback) {
    try {
    await Validate();
    } catch(e) {

    }
    callback();
}
