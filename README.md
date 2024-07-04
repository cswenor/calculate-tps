
# Voi Blockchain Transactions Per Second (TPS) Calculator

This script calculates the average transactions per second (TPS) for a specified range of blocks or for the last 1000 blocks on the Voi blockchain. It also identifies the top 10 blocks by transaction count within the specified range and provides their block processing times.

## Prerequisites

Ensure you have Node.js installed on your system. You will also need to install the following npm packages:

- `algosdk`: Algorand SDK for JavaScript
- `yargs`: For command-line argument parsing

Install the packages using npm:

```sh
npm install algosdk yargs
```

## Setup

Replace the placeholder values for the Algod client parameters in `calculate_tps.js` with your actual API key and endpoint.

```javascript
const algodAddress = "https://testnet-api.voi.nodly.io/";
const algodToken = {
    'X-API-Key': 'YOUR_API_KEY'
};
```

## Usage

### Calculating TPS for the Last 1000 Blocks

To calculate the TPS for the last 1000 blocks, simply run the script without any arguments:

```sh
node calculate_tps.js
```

### Calculating TPS for a Specified Range of Blocks

To calculate the TPS for a specified range of blocks, use the `-s` (start block) and `-e` (end block) flags:

```sh
node calculate_tps.js -s <start_block_number> -e <end_block_number>
```

For example:

```sh
node calculate_tps.js -s 1000000 -e 1001000
```

## Output

The script will output the following information:

- Average Transactions per Second (TPS)
- Start block time
- End block time
- Time difference in seconds
- Total number of transactions
- Top 10 blocks by transaction count, including:
  - Block number
  - Number of transactions
  - Block processing time in seconds

Example output:

```sh
Average Transactions per Second (TPS) for the last 1000 blocks: 5.23
Start block time: 2023-06-01T00:00:00.000Z
End block time: 2023-06-02T00:00:00.000Z
Time difference: 86400 seconds
Total number of transactions: 45000
Top 10 blocks by transaction count:
Block 1:
  Block number: 1000500
  Number of transactions: 200
  Block processing time: 4.00 seconds
Block 2:
  Block number: 1000600
  Number of transactions: 180
  Block processing time: 3.50 seconds
...
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Please feel free to submit issues, fork the repository, and send pull requests.

## Acknowledgments

- Algorand SDK for JavaScript
- Yargs for command-line argument parsing
