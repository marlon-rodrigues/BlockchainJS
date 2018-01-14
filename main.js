const SHA256 = require('./node_modules/crypto-js/sha256');

class Block {
	constructor(index, timestamp, data, previousHash = '') {
		this.index = index;
		this.previousHash = previousHash;
		this.timestamp = timestamp;
		this.data = data;
		this.hash = this.calculateHash();
	}

    calculateHash() {
		return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
	}
}

class Blockchain {
	constructor() {
		this.chain = [this.createGenesisBlock()];
	}

    createGenesisBlock() {
		return new Block(0, "14/01/2017", "First Block", "0");
	}

	getLatestBlock() {
		return this.chain[this.chain.length - 1];
	}

	addBlock(newBlock) {
		newBlock.previousHash = this.getLatestBlock().hash;
		newBlock.hash = newBlock.calculateHash();
		this.chain.push(newBlock);
	}

	isChainValid() {
		for (let i = 1; i < this.chain.length; i++) {
			const currentBlock = this.chain[i];
			const previousBlock = this.chain[i - 1];

			if (currentBlock.hash !== currentBlock.calculateHash()) {
				return false;
			}

			if (currentBlock.previousHash !== previousBlock.hash) {
				return false;
			}
		}

		return true;
	}
}

let theBestCoin = new Blockchain();
theBestCoin.addBlock(new Block(1, "15/01/2017", { value: 5 }));
theBestCoin.addBlock(new Block(2, "15/01/2017", { value: 10 }));

// show results
console.log(JSON.stringify(theBestCoin, null ,4));

// should return true
console.log(`Is Blockchain valid? ${theBestCoin.isChainValid()}`);

console.log('Changing block...');
theBestCoin.chain[1].data = { value: 50 };

// should return false
console.log(`Is Blockchain valid? ${theBestCoin.isChainValid()}`);