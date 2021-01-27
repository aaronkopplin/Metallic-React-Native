// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <=0.8.1;
pragma experimental ABIEncoderV2;

contract Metallic {
    constructor() {}

    struct UserAccount {
        bytes16 username;
        bytes16 public_name;
        address public_address;
    }

    bytes16[] listOfAccounts;
    mapping (bytes16 => UserAccount) private accounts;

    function addAccount(bytes16 username, bytes16 public_name) public {

        for (uint i = 0; i < 16; i++ ){
            require(((username[i] >= 0x30 && username[i] <= 0x39) //digits
                  || ((username[i] >= 0x41 && username[i] <= 0x5A) || (username[i] >= 0x61 && username[i] <= 0x7A)) //letters
                  || (username[i] == 0x5F)), "Username Invalid");
        }

        for (uint i = 0; i < 16; i++) {
            require(((public_name[i] >= 0x41 && public_name[i] <= 0x5A)  // uppercase letters
                  || (public_name[i] >= 0x61 && public_name[i] <= 0x7A)  // lowercase letters
                  || (public_name[i] == 0x20)), "public name invalid");
        }

        _addAccount(username, public_name);
    }

    function _addAccount(bytes16 username, bytes16 public_name) internal virtual {

        bool usernameExists = accounts[username].public_address != address(0x0000000000000000000000000000000000000000);

        require (!usernameExists, "Username already exists.");

        UserAccount memory newUser = UserAccount(username, public_name, msg.sender);
        accounts[username] = newUser;
        listOfAccounts.push(username);
    }

    function getAccounts() public view returns (bytes16[] memory){ return listOfAccounts; }

    function getAddress(bytes16 username) public view returns (address) {
        return accounts[username].public_address;
    }

    function getPublicName(bytes16 username) public view returns (bytes16) {
        return accounts[username].public_name;
    }


    function helloWorld() public pure returns (string memory) {
        return "Hello World";
    }
}