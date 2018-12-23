import axios from "axios";
import * as types from "../constants";
import * as transaction from "../lib/transaction";
import * as chainAction from "./chainAction";

export const followSuccess = () => ({
    type: types.FOLLOW_SUCCESS,
});

export const followError = (errorMessage) => ({
    type: types.FOLLOW_ERROR,
    errorMessage
});

const encodeFollowTransaction = function(user, publicKey, dispatch, thisSequence) {
    let req = "https://komodo.forest.network/tx_search?query=%22account=%27" + user.public_key + "%27%22";
    let txEncode = '0x';
    axios.get(req)
        .then(res => {
            const data = res.data.result.txs.map((each) => {
                each.tx = transaction.decodeTransaction(each.tx);
                each.tx.memo = each.tx.memo.toString();
                each.tx.signature = each.tx.signature.toString('hex');
                return each;
            })
            let sequence = transaction.findSequenceAvailable(data, user.public_key);
            let addresses = [publicKey];
            console.log(`sequence: ${sequence}`);
            const tx = {
                version: 1,
                operation: "update_account",
                params: {
                    key: 'followings',
                    // value: Buffer.from(base32.encode())
                },
                account: user.public_key,
                sequence: thisSequence,
                memo: Buffer.alloc(0),
            }
            transaction.sign(tx, user.private_key);
            txEncode = '0x' + transaction.encode(tx).toString('hex');

            return axios.post("https://komodo.forest.network/broadcast_tx_commit?tx=" + txEncode);
        })
        .then((res) => {
            if (res.data.error === undefined) {
                if (res.data.result.height === "0") {
                    dispatch(followError('sequence mismatch'));
                } else {
                    dispatch(followSuccess());
                    dispatch(chainAction.getSequence(++thisSequence))
                }
            } else {
                dispatch(followError(res.data.error.message));
            }
        })
        .catch((err) => {
            dispatch(followError(err));
        });
}

export const onFollow = (publicKey) => {
    return (dispatch, getState) => {
        const { public_key, private_key } = getState().auth;
        const user = { public_key, private_key };
        const thisSequence = getState().sequence
        encodeFollowTransaction(user, publicKey, dispatch, thisSequence);
    };
};