const Web3 = require("web3");

export class Metallic {
    constructor() {
        const abi_address = require("./abi_address.json");
        this.web3 = new Web3(
            new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545")
        );
        this.contract = new web3.eth.Contract(
            abi_address["abi"],
            abi_address["address"]
        );
    }

    helloWorld() {
        contract.methods.helloWorld().call((err, msg) => {
            return { err, msg };
        });
    }
}
