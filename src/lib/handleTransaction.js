import * as transaction from "./transaction";
import * as v1 from './transaction/v1';
import axios from "axios";

export function findSequenceAvailable(data, public_key) {
    data.reverse();
    for (const block of data) {
        if (block.tx.account === public_key)
            return block.tx.sequence + 1;
    }
    return 1;
}

export function encodeCreateAccountTransaction(account, address, private_key) {
    return new Promise((resolve, reject) => {
        var req = "https://komodo.forest.network/tx_search?query=%22account=%27" + account + "%27%22"
        axios.get(req)
            .then(response => {
                const data = response.data.result.txs.map((each) => {
                    each.tx = decodeTransaction(each.tx);
                    each.tx.memo = each.tx.memo.toString();
                    each.tx.signature = each.tx.signature.toString('hex');
                    return each;
                })
                var sequence = findSequenceAvailable(data, account);
                const tx = {
                    version: 1,
                    operation: "create_account",
                    params: {
                        address: address,
                    },
                    account: account,
                    sequence: sequence,
                    memo: Buffer.alloc(0),
                }
                transaction.sign(tx, private_key);

                const txEncode = "0x" + transaction.encode(tx).toString('hex')
                resolve(txEncode);
            })
            .catch(error => {
                console.log(error);
            });
    }, err => {
        // reject(err);
    });
}

export function encodePaymentTransaction(account, address, amount, private_key) {
    return new Promise((resolve, reject) => {
        var req = "https://komodo.forest.network/tx_search?query=%22account=%27" + account + "%27%22"
        axios.get(req)
            .then(response => {
                const data = response.data.result.txs.map((each) => {
                    each.tx = decodeTransaction(each.tx);
                    each.tx.memo = each.tx.memo.toString();
                    each.tx.signature = each.tx.signature.toString('hex');
                    return each;
                })
                var sequence = findSequenceAvailable(data, account);
                const tx = {
                    version: 1,
                    operation: "payment",
                    params: {
                        address: address,
                        amount: amount,
                    },
                    account: account,
                    sequence: sequence,
                    memo: Buffer.alloc(0),
                }
                transaction.sign(tx, private_key);
                const txEncode = "0x" + transaction.encode(tx).toString('hex')
                resolve(txEncode);
            })
            .catch(error => {
                console.log(error);
            });
    }, err => {
        // reject(err);
    });
}

export function encodePostTransaction(account, content, private_key) {
    return new Promise((resolve, reject) => {
        var req = "https://komodo.forest.network/tx_search?query=%22account=%27" + account + "%27%22"
        axios.get(req)
            .then(response => {
                const data = response.data.result.txs.map((each) => {
                    each.tx = decodeTransaction(each.tx);
                    each.tx.memo = each.tx.memo.toString();
                    each.tx.signature = each.tx.signature.toString('hex');
                    return each;
                })
                var sequence = findSequenceAvailable(data, account);
                const tx = {
                    version: 1,
                    operation: "post",
                    params: {
                        keys: [],
                        content: content,
                    },
                    account: account,
                    sequence: sequence,
                    memo: Buffer.alloc(0),
                }
                transaction.sign(tx, private_key);
                const txEncode = "0x" + transaction.encode(tx).toString('hex')
                resolve(txEncode);
            })
            .catch(error => {
                console.log(error);
            });
    }, err => {
        // reject(err);
    });
}

export const decodeTransaction = (data) => {
    var transaction = v1.decode(Buffer.from(data, 'base64'));
    return transaction;
}