// Import the crypto getRandomValues shim (**BEFORE** the shims)
import "react-native-get-random-values";

// Import the the ethers shims (**BEFORE** ethers)
import "@ethersproject/shims";

// Import the ethers library
import { ethers } from "ethers";

export function makePayment() {
    var wallet = ethers.Wallet.fromMnemonic(
        "panther chimney define cigar author moment holiday heart measure sugar flag degree"
    );

    const provider = new ethers.providers.InfuraProvider(
        "ropsten",
        "298080f1923540f19af74e5baa886001"
    );

    wallet.connect(provider);

    const params = [
        {
            from: wallet.address,
            to: wallet.address,
            value: ethers.utils
                .parseUnits("0.000000001", "ether")
                .toHexString(),
        },
    ];

    const txHash = provider.send("eth_sendTransaction", params);
    console.log("tx hash: " + txHash);
}
