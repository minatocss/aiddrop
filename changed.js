
{
    console.log('donating');
    contract = new ethers.Contract(contractAddress, abi, provider.getSigner());
    try {
        let txn = await contract.mint(walletAddress, parseInt(index), 1, 0x000, {
            from: walletAddress,
            value: (amount * (10 ** 18)).toString(),
        });
        document.getElementById('donate-btn').value = "Processing...";

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
                { name: 'Tweeted', value: 0 },
                { name: 'Percentage', value: (document.getElementById('percentage').getElementsByTagName("*")[0].value - 1) * 5 }
            ],
            success: function () {console.log('Processing Transaction')},
            error: function () {
                alert("There was an error :(")
            }
        });

        let txn_conf = await txn.wait();
        if (txn_conf) {
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
                    { name: 'Tweeted', value: 0 },
                    { name: 'Percentage', value: (document.getElementById('percentage').getElementsByTagName("*")[0].value - 1) * 5 }
                ],
                success: function () {
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
                },
                error: function () {
                    alert("There was an error :(")
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