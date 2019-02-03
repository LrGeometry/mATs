/**
Copyright (c) 2018 AnthemGold INC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

pragma solidity ^0.5.0;

import './../AGLDTokenV1.sol';

/**
 * @title AGLDTokenV2NewFieldsNewLogicTest
 * @dev ERC20 Token backed by Gold Bullion reserves
 */
contract AGLDTokenV2NewFieldsNewLogicTest is AGLDTokenV1 {

    bool public newBool;
    address public newAddress;
    uint256 public newUint;
    bool internal initializedV2;

    function initialize(
        string memory _name,
        string memory _symbol,
        string memory _currency,
        uint8 _decimals,
        address _masterMinter,
        address _pauser,
        address _blacklister,
        address _owner,
        bool _newBool,
        address _newAddress,
        uint256 _newUint
    ) public {
        super.initialize(_name, _symbol, _currency, _decimals, _masterMinter, _pauser, _blacklister, _owner);
        initV2(_newBool, _newAddress, _newUint);
    }

    function initV2(bool _newBool, address _newAddress, uint256 _newUint) public {
        require(!initializedV2);
        newBool = _newBool;
        newAddress = _newAddress;
        newUint = _newUint;
        initializedV2 = true;
    }

    function setNewAddress(address _newAddress) public {
        newAddress = _newAddress;
    }
}
