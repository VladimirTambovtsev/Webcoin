const Transaction = require('./transaction');
const Wallet = require('./index');
const { MINING_REWARD } = require('../config');


describe('Transaction', () => {
	let transaction, wallet, recipient, amount;

	beforeEach(() => {
		wallet = new Wallet();
		amount = 50;
		recipient = '12345';
		transaction = Transaction.newTransaction(wallet, recipient, amount);
	});


	it('outputs the `amount` from the wallet balance', () => {
		expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
			.toEqual(wallet.balance - amount);
	});

	it('outputs the `amount` added to recipient', () => {
		expect(transaction.outputs.find(output => output.address === recipient).amount)
			.toEqual(amount);
	});

	it('inputs the balance of the wallet ', () => {
		expect(transaction.input.amount).toEqual(wallet.balance);
	});

	it('validates a valid transaction', () => {
		expect(Transaction.verifyTransaction(transaction)).toBe(true);
	});	

	it('invalidates a corrupt transaction', () => {
		transaction.outputs[0].amount = 50000;
		expect(Transaction.verifyTransaction(transaction)).toBe(false);
	});



	describe('transacting the amount with exceeds the balance', () => {
		beforeEach(() => {
			amount = 50000;
			transaction = Transaction.newTransaction(wallet, recipient, amount);
		});

		it('does not create the transaction', () => {
			expect(transaction).toEqual(undefined);
		});
	});


	describe('and updatign the transaction', () => {
		let nextAmount, nextRecipient;

		beforeEach(() => {
			nextAmount = 20;
			nextRecipient = 'n3xt-4ddr355';
			transaction = transaction.update(wallet, nextRecipient, nextAmount);
		});

		it('substact the next amount from the sender"s amount', () => {
			expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
				.toEqual(wallet.balance - amount - nextAmount);
		});

		it('outputs the amount for the next recipient', () => {
			expect(transaction.outputs.find(output => output.address === nextRecipient).amount)
				.toEqual(nextAmount);
		});
	});

	describe('creating the reward transaction', () => {
		beforeEach(() => {
			transaction = Transaction.rewardTranscation(wallet, Wallet.blockchainWallet());
		});


		it('reward  the miner`s wallet', () => {
			expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
				.toEqual(MINING_REWARD);
		});
	});
});
