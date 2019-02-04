pragma solidity ^0.5.0;

import './Proxy.sol';
import './Address.sol';

/**
 * @title UpgradeabilityProxy
 * @dev This contract implements a proxy that allows to change the
 * implementation address to which it will delegate.
 * Such a change is called an implementation upgrade.
 */
contract UpgradeabilityProxy is Proxy {
  /**
   * @dev Emitted when the implementation is upgraded.
   * @param implementation Address of the new implementation.
   */
  event Upgraded(address implementation);

  /**
   * @dev Storage slot with the address of the current implementation.
   * This is the keccak-256 hash of "org.zeppelinos.proxy.implementation", and is
   * validated in the constructor.
   */
  bytes32 private constant IMPLEMENTATION_SLOT = 0x10d6a54a4754c8869d6886b5f5d7fbfa5b4522237ea5c60d11bc4e7a1ff9390b;

  /**
   * @dev Contract constructor.
   * @param _implementation Address of the initial implementation.
   */
  function UpgradeabilityProxyC(address _implementation) public {
    assert(IMPLEMENTATION_SLOT == keccak256("org.zeppelinos.proxy.implementation"));

    _setImplementation(_implementation);
  }

  /**
   * @dev Returns the current implementation.
   * @return Address of the current implementation
   */
  function _implementation() internal view returns (address impl) {
    bytes32 slot = IMPLEMENTATION_SLOT;
    assembly {
      impl := sload(slot)
    }
  }

  /**
   * @dev Upgrades the proxy to a new implementation.
   * @param newImplementation Address of the new implementation.
   */
  function _upgradeTo(address newImplementation) internal {
    _setImplementation(newImplementation);
    emit Upgraded(newImplementation);
  }

  /**
   * @dev Sets the implementation address of the proxy.
   * @param newImplementation Address of the new implementation.
   */
  function _setImplementation(address newImplementation) private {
    require(Address.isContract(newImplementation));

    bytes32 slot = IMPLEMENTATION_SLOT;

    assembly {
      sstore(slot, newImplementation)
    }
  }
}