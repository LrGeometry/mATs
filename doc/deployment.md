# Initial Deployment

This is the process for deploying a new proxy and implementation (as opposed to upgrading an existing proxy).

Since the proxy uses `delegatecall` to forward calls to the implementation initialization of the contracts becomes a little
tricky because we can not initialize fields in the implementation contrat via the constructor. Instead there is an initialize
method in the implementation contract, which is publicly available, but can only be called once per proxy.


## Deploying the implementation contract
1. Deploy [mATV1](../contracts/mATV1.sol)
2. Initialize the fields in AGLDToken via the `initialize` method. The values are not important, but this will stop anyone
else initializing the roles and trying to use it as a token or pass it off as a real AnthemGold token. 
   ```
   initialize(
          "",
          "",
          "",
          0,
          throwawayAddress,
          throwawayAddress,
          throwawayAddress,
          throwawayAddress
          )
   ```
3. Verify that all fields in the AGLDToken have been initialized correctly and have the expected values.

