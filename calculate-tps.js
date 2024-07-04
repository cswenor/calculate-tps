const algosdk = require('algosdk');
const yargs = require('yargs');

// Function to calculate average transactions per second between two block numbers
async function avgTpsBetweenBlocks(algodClient, startBlock, endBlock) {
    try {
        const startBlockInfo = await algodClient.block(startBlock).do();
        const endBlockInfo = await algodClient.block(endBlock).do();
        
        const startTime = startBlockInfo.block.ts;
        const endTime = endBlockInfo.block.ts;
        
        let totalTransactions = 0;
        let topBlocks = [];

        for (let blockNum = startBlock; blockNum <= endBlock; blockNum++) {
            const blockInfo = await algodClient.block(blockNum).do();
            const numTxs = blockInfo.block.txns ? blockInfo.block.txns.length : 0;
            totalTransactions += numTxs;

            if (numTxs > 0) {
                const prevBlockInfo = await algodClient.block(blockNum - 1).do();
                const blockTime = blockInfo.block.ts - prevBlockInfo.block.ts;
                topBlocks.push({
                    blockNum: blockNum,
                    txs: numTxs,
                    blockTime: blockTime
                });

                // Keep only top 10 blocks
                topBlocks.sort((a, b) => b.txs - a.txs);
                if (topBlocks.length > 10) {
                    topBlocks.pop();
                }
            }
        }
        
        const timeDiff = endTime - startTime;
        const avgTps = totalTransactions / timeDiff;
        
        return {
            avgTps,
            topBlocks,
            startTime,
            endTime,
            timeDiff,
            totalTransactions
        };
    } catch (error) {
        console.error('Error calculating TPS:', error);
        process.exit(1);
    }
}

// Function to calculate average transactions per second for the last 1000 blocks
async function avgTpsLastBlocks(algodClient, numBlocks) {
    try {
        const status = await algodClient.status().do();
        const endBlock = status['last-round'];
        const startBlock = endBlock - numBlocks + 1;

        return avgTpsBetweenBlocks(algodClient, startBlock, endBlock);
    } catch (error) {
        console.error('Error calculating TPS for the last 1000 blocks:', error);
        process.exit(1);
    }
}

// Command line arguments parsing
const argv = yargs
    .option('start-block', {
        alias: 's',
        description: 'The starting block number',
        type: 'number',
    })
    .option('end-block', {
        alias: 'e',
        description: 'The ending block number',
        type: 'number',
    })
    .help()
    .alias('help', 'h')
    .argv;

// Replace these with your actual Algod client parameters
const algodAddress = "https://testnet-api.voi.nodly.io/"; // New address
const algodToken = {
    'X-API-Key': 'YOUR_API_KEY' // Replace with your actual API key
};

// Initialize an Algod client
const algodClient = new algosdk.Algodv2(algodToken, algodAddress, '');

(async () => {
    let results;

    if (argv['start-block'] && argv['end-block']) {
        results = await avgTpsBetweenBlocks(algodClient, argv['start-block'], argv['end-block']);
        console.log(`Average Transactions per Second (TPS) between blocks ${argv['start-block']} and ${argv['end-block']}: ${results.avgTps.toFixed(2)}`);
    } else {
        const numBlocks = 1000;
        results = await avgTpsLastBlocks(algodClient, numBlocks);
        console.log(`Average Transactions per Second (TPS) for the last ${numBlocks} blocks: ${results.avgTps.toFixed(2)}`);
    }

    console.log(`Start block time: ${new Date(results.startTime * 1000).toISOString()}`);
    console.log(`End block time: ${new Date(results.endTime * 1000).toISOString()}`);
    console.log(`Time difference: ${results.timeDiff} seconds`);
    console.log(`Total number of transactions: ${results.totalTransactions}`);

    console.log("Top 10 blocks by transaction count:");
    results.topBlocks.forEach((block, index) => {
        console.log(`Block ${index + 1}:`);
        console.log(`  Block number: ${block.blockNum}`);
        console.log(`  Number of transactions: ${block.txs}`);
        console.log(`  Block processing time: ${block.blockTime.toFixed(2)} seconds`);
    });
})();
