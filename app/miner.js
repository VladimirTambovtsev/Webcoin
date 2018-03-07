const Wallet = require('../wallet');
const Transaction = require('../wallet/transaction');

class Miner {
	constructor(blockchain, transactionPool, wallet, p2pServer) {
		this.blockchain = blockchain;
		this.transactionPool = transactionPool;
		this.wallet = wallet
		this.p2pServer = p2pServer;
	}

	mine() {
		const validTransactions = this.transactionPool.validTransactions();

		validTransactions.push(Transaction.rewardTranscation(this.wallet, Wallet.blockchainWallet())); // include reward
		const block = this.blockchain.addBlock(validTransactions);	// create a block of the valid transactions

		this.p2pServer.syncChains();	// sycnronize the chain in p2p
		this.transactionPool.clear();	// clear the transaction pool
		this.p2pServer.broadcastClearTransactions();	// broadcast to every miner to clear transaction pools

		return block;
	}
}


module.exports = Miner;