//imports
const fs = require("fs-extra");
const Web3 = require("web3");
var Tx = require("ethereumjs-tx").Transaction;
const solc = require("solc");
const path = require("path");

function compile_deploy(
    web3,
    public_address,
    private_key,
    contract_text,
    contract_name,
    compiled_contract_filename = null
) {
    const compiled_contract = solc.compile(
        JSON.stringify({
            language: "Solidity",
            sources: {
                filename: {
                    content: contract_text,
                },
            },
            settings: {
                outputSelection: {
                    "*": {
                        "*": ["*"],
                    },
                },
            },
        })
    );

    if (compiled_contract_filename) {
        fs.writeFileSync(compiled_contract_filename, compiled_contract);
    }

    json_contract = JSON.parse(compiled_contract);
    var bytecode =
        json_contract["contracts"]["filename"][contract_name]["evm"][
            "bytecode"
        ]["object"];

    var abi = json_contract["contracts"]["filename"][contract_name]["abi"];
    var address;

    web3.eth.getTransactionCount(public_address, (err, txCount) => {
        const txObject = {
            nonce: web3.utils.toHex(txCount),
            gasLimit: web3.utils.toHex(2000000), // Raise the gas limit to a much higher amount
            gasPrice: web3.utils.toHex(web3.utils.toWei("50", "gwei")),
            data: "0x" + bytecode,
        };

        const tx = new Tx(txObject);
        tx.sign(Buffer.from(private_key, "hex"));

        const serializedTx = tx.serialize();
        const raw = "0x" + serializedTx.toString("hex");

        web3.eth
            .sendSignedTransaction(raw, (err, txHash) => {})
            .on("receipt", function (receipt) {
                address = receipt.contractAddress;

                data = {
                    abi: abi,
                    address: address,
                };

                fs.writeFile(
                    "abi_address.json",
                    JSON.stringify(data),
                    (err) => {
                        // In case of a error throw err.
                        if (err) throw err;
                    }
                );
            });
    });
}

public_address = "0x8E66eFD12CEf8392973cF30759FA0b6DDB9bD30D";
private_key =
    "d6fb284ea2f11ec9782c9fbffa32fec563ab88d5aa13fadb20f87afc91c3421a";
let web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"));
const file_name = "metallic.sol";
const contract_text = fs.readFileSync(path.join(__dirname, file_name), "utf8");

compile_deploy(
    web3,
    public_address,
    private_key,
    contract_text,
    "Metallic",
    "metallic_contract_compiled.json"
);
