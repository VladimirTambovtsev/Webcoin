const Block = require('./block');


describe('Block', () => {
	let data, lastBlock, block;

	beforeEach(() => {
		data = 'bar';
		lastBlock = Block.genesis();
		block = Block.mineBlock(lastBlock, data);
	});

	it('sets the `data` to match input', () => {
		expect(block.data).toEqual(data);
	});
	it('sets the `lastHash` to match the hash of the previous block', () => {
		expect(block.lastHash).toEqual(lastBlock.hash);
	});

	it('generates a hash that matches a difficulty', () => {
		expect(block.hash.substring(0, block.difficulty)).toEqual('0'.repeat(block.difficulty));
		console.log(block.toString());
	});

	it('lowers the difficulty for slowly mined blocks', () => {
		expect(Block.adjustDifficulty(block, block.timestamp + 360000)).toEqual(block.difficulty-1);
	});

	it('raises the difficulty for quickly mined blocks', () => {
		expect(Block.adjustDifficulty(block, block.timestamp + 1)).toEqual(block.difficulty+1);
	});
});