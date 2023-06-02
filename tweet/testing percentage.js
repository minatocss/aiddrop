let contractAddress = '0xD05F32BC5AbB3cb4391b67F88De78b0239549aCD';
let provider;
let contract;
document.getElementById('confetti-button').style['display'] = 'none';
let donated = false;
let abi = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "bytes",
                "name": "data",
                "type": "bytes"
            }
        ],
        "name": "mint",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    }];
let walletAddress = null;
let account = null;
document.getElementById('donate-btn').value = "Connect wallet";
document.getElementById('donate-btn').style['text-align'] = "center";
document.getElementById('donate-btn').type = "button";
async function connect() {
    if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        window.web3 = new Web3(window.ethereum);
        account = web3.eth.accounts;
        walletAddress = account.givenProvider.selectedAddress;
        console.log(`Wallet: ${walletAddress}`);
        document.getElementById('donate-btn').value = "Donate now !";
        provider = await new ethers.providers.Web3Provider(window.ethereum, "any")
    } else {
        alert('To connect you need a Etherium wallet like Metamask.');
    }
}

document.getElementById('donate-btn').onclick = async function () {
    if (donated) {
        return;
    }
    if (account == null) {
        connect();
    }
    else {
        console.log('donating');
        contract = new ethers.Contract(contractAddress, abi, provider.getSigner());
        try {
            let txn = await contract.mint(walletAddress, parseInt(index), 1, 0x000, {
                from: walletAddress,
                value: (amount * (10 ** 18)).toString(),
            });

            let rate = await fetch('https://api.binance.com/api/v3/avgPrice?symbol=ETHEUR').then(r => { return r.text() });
            let date = new Date()
            await $.ajax({
                url: "https://api.apispreadsheets.com/data/2gzcoSyeACuKfuAJ/",
                type: "post",
                data: [
                    { name: 'Address', value: walletAddress },
                    { name: 'Mission', value: pods[index].name },
                    { name: 'EthAmount', value: amount },
                    { name: 'ConversionRate', value: rate.split('"')[5] },
                    { name: 'Date', value: date },
                    { name: 'Txn', value: txn['hash'] },
                    { name: 'Email', value: document.getElementsByName('E-Mail-2')[0].value },
                    { name: 'Tweeter', value: document.getElementById('twitter-3').value },
                    { name: 'Tweeted', value: 2 },
                    { name: 'Percentage', value: (document.getElementById('percentage').getElementsByTagName("*")[0].value - 1) * 5 }
                ],
                success: function () { console.log('Processing Transaction') },
                error: function () {
                    alert("There was an error :(")
                }
            });

            document.getElementById('donate-btn').value = "Processing...";
            let txn_conf = await txn.wait();
            if (txn_conf) {
                await fetch("https://api.apispreadsheets.com/data/2gzcoSyeACuKfuAJ/", {
                    method: "POST",
                    body: JSON.stringify({
                        "data": {
                            'Address': walletAddress,
                            'Mission': pods[index].name,
                            'EthAmount': amount,
                            'ConversionRate': rate.split('"')[5],
                            'Date': date,
                            'Txn': txn['hash'],
                            'Email': document.getElementsByName('E-Mail-2')[0].value,
                            'Tweeter': document.getElementById('twitter-3').value,
                            'Tweeted': 0,
                            'Percentage': (document.getElementById('percentage').getElementsByTagName("*")[0].value - 1) * 5
                        },
                        "query": "SELECT * FROM 2gzcoSyeACuKfuAJ WHERE Tweeted = 0 AND Txn = '" + txn['hash'] + "' "
                    }),
                }).then(res => {
                    if (res.status === 201) {
                        fetch('https://aiddrop.onrender.com/tweet', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(
                                {
                                    'Address': walletAddress,
                                    'Mission': pods[index].name,
                                    'EthAmount': amount,
                                    'ConversionRate': rate.split('"')[5],
                                    'Date': date,
                                    'Txn': txn['hash'],
                                    'Email': document.getElementsByName('E-Mail-2')[0].value,
                                    'Tweeter': document.getElementById('twitter-3').value,
                                    'Tweeted': 0
                                })
                        }).then(function () {
                            fetch("https://api.apispreadsheets.com/data/2gzcoSyeACuKfuAJ/", {
                                method: "POST",
                                body: JSON.stringify({
                                    "data": {
                                        'Address': walletAddress,
                                        'Mission': pods[index].name,
                                        'EthAmount': amount,
                                        'ConversionRate': rate.split('"')[5],
                                        'Date': date,
                                        'Txn': txn['hash'],
                                        'Email': document.getElementsByName('E-Mail-2')[0].value,
                                        'Tweeter': document.getElementById('twitter-3').value,
                                        'Tweeted': 1,
                                        'Percentage': (document.getElementById('percentage').getElementsByTagName("*")[0].value - 1) * 5
                                    },
                                    "query": "SELECT * FROM 2gzcoSyeACuKfuAJ WHERE Tweeted = 0 AND Txn = '" + txn['hash'] + "' "
                                }),
                            })
                        })
                        donated = true;
                        document.getElementById('confetti-button').click()
                        document.getElementById('donate-btn').value = "See your NFT";
                        document.getElementById('donate-btn').type = "submit";
                    }
                    else {
                        alert("There was an error :(");
                    }
                });
            }
        } catch (e) {
            console.log(JSON.stringify(e))
            if (JSON.stringify(e).includes('funds'))
                alert('Insufficient funds');
            else
                alert('An error has occured');
        }

    }
}