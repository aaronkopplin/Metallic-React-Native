// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <=0.8.0;
pragma experimental ABIEncoderV2;

contract UsernameDatabase {

    struct UserAccount {
        string username;
        string public_address;
        string currency;
        string creationDate;
    }

    UserAccount[] listOfAccounts;
    mapping (string => UserAccount) private accounts;

    constructor() {}

    function getAccounts() public view returns (UserAccount[] memory){
        return listOfAccounts;
    }

    function _addAccount(string memory username, 
                        string memory public_address, 
                        string memory currency,
                        string memory creationDate) internal virtual {
        require (bytes(username).length != 0, "Username cannot be empty");
        require (bytes(public_address).length != 0, "Public Address cannot be empty");
        require (!usernameExists(username), "Username already exists.");

        // if the username is unused, add it to the database
        UserAccount memory newUser = UserAccount(username, public_address, currency, creationDate);
        accounts[username] = newUser;
        listOfAccounts.push(newUser);
    }

    function usernameExists(string memory username) public view returns (bool) {
        UserAccount memory user = accounts[username];
        return keccak256(bytes(user.username)) != keccak256("") && keccak256(bytes(user.public_address)) != keccak256("");
    }

    function getAddress(string memory username) public view returns (string memory) {
        UserAccount memory user = accounts[username];
        return user.public_address;
    }
}

contract Metallic is UsernameDatabase{

    function substring(string memory str, uint startIndex, uint endIndex) internal pure returns (string memory) {
        bytes memory strBytes = bytes(str);
        bytes memory result = new bytes(endIndex-startIndex);
        for(uint i = startIndex; i < endIndex; i++) {
            result[i-startIndex] = strBytes[i];
        }
        return string(result);
    }

    function isDigit(bytes1 char) private pure returns (bool){
        return char >= 0x30 && char <= 0x39;
    }

    function isLetter(bytes1 char) private pure returns (bool) {
        return (char >= 0x41 && char <= 0x5A) || (char >= 0x61 && char <= 0x7A);
    }

    function isUnderscore(bytes1 char) private pure returns (bool){
        return char == 0x5F;
    }

    function helloWorld() public pure returns (string memory) {
        return "Hello World";
    }

    function isValidUsername(string memory username) private pure returns (bool){
        require(bytes(username).length <= 32, "Usernames must be 32 characters or less.");
        require(bytes(username).length >= 1, "Usernames must be at least one character");

        for (uint i = 0; i < bytes(username).length; i++ ){
            bytes1 char = bytes(substring(username, i, i+1))[0];
            if (!isDigit(char) && ! isLetter(char) && !isUnderscore(char)){
                return false;
            }
        }

        return true;
    }

    function isValidCurrency(string memory currency) private pure returns (bool) {
        require(bytes(currency).length <= 32, "Currency must be 32 characters or less.");
        require(bytes(currency).length > 1, "Currency must be at least one character");

        for (uint i = 0; i < bytes(currency).length; i++) {
            bytes1 char = bytes(substring(currency, i, i+1))[0];
            if (!isLetter(char)){
                return false;
            }
        }
        return true;
    }

    //add a username for an address
    function addAccount(string memory username, 
                        string memory public_address, 
                        string memory currency,
                        string memory creationDate) public {
        require(isValidUsername(username), "Username invalid");
        require(isValidCurrency(currency), "Currency invalid");

        super._addAccount(username, public_address, currency, creationDate);
    }
}