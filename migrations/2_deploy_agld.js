var AGLDTokenV1 = artifacts.require("./AGLDTokenV1.sol");
var AGLDTokenProxy = artifacts.require("./AGLDTokenProxy.sol");

// Any address will do, preferably one we generated
var throwawayAddress = "0x64e078a8aa15a41b85890265648e965de686bae6";

module.exports = function(deployer, network, accounts) {

    if( network == "development" || network == "coverage") {
        // Change these to the cold storage addresses provided by ops
        // these are the deterministic addresses from ganache, so the private keys are well known
        // and match the values we use in the tests
        var admin = "GETFROMJOSH";
        var masterMinter = "GETFROMJOSH";
        var pauser = "GETFROMJOSH";
        var blacklister = "GETFROMJOSH";
        var owner = "GETFROMJOSH";
    }

    console.log("deploying impl")

    var agldTokenImpl;
    var tokenProxy;
    // deploy implementation contract
    deployer.deploy(AGLDTokenV1)
        .then(function(impl) {
            agldTokenImpl = impl;
            console.log("initializing impl with dummy values")
            return impl.initialize(
                "",
                "",
                "",
                0,
                throwawayAddress,
                throwawayAddress,
                throwawayAddress,
                throwawayAddress
            );
        })
        .then(function(initDone){
            console.log("deploying proxy");
            return deployer.deploy(AGLDTokenProxy, agldTokenImpl.address);
        })
        .then(function(proxy){
            tokenProxy = proxy;
            console.log("reassigning proxy admin");
            // need to change admin first, or the call to initialize won't work
            // since admin can only call methods in the proxy, and not forwarded methods
            return proxy.changeAdmin(admin);
        })
        .then(function(changeAdminDone){
            console.log("initializing proxy");
            // Pretend that the proxy address is a FiatTokenV1
            // this is fine because the proxy will forward all the calls to the FiatTokenV1 impl
            tokenProxy = AGLDTokenV1.at(tokenProxy.address);
            return tokenProxy.initialize(
                "A//GLD",
                "AGLD",
                "AU",
                9,
                masterMinter,
                pauser,
                blacklister,
                owner
            );
        })
        .then(function(initDone) {
            console.log("Deployer proxy at ", tokenProxy.address);
        });
};