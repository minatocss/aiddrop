if (index != 26) {
	document.getElementById('progress-area').style.display = 'none'
}
else {
	var end = new Date("12/02/2023 08:00 AM");
	let progress_function = function () {
		fetch("https://api.apispreadsheets.com/data/2gzcoSyeACuKfuAJ/").then(res => {
			if (res.status === 200) {
				// SUCCESS
				res.json().then(data => {
					const donations_data = data
					const donations = donations_data['data'];
					let total_sum_euro = 0;
					let total_sum_eth = 0;
					let quantity = 0;
					donations.forEach(function (d) {
						if (d['Mission'].includes('Earthquake')) {
							total_sum_euro += parseFloat(d['EthAmount']) * parseFloat(d['ConversionRate']);
							total_sum_eth += parseFloat(d['EthAmount']);
							quantity += 1
						}
					});
					document.getElementById('percentage-amount').innerHTML = total_sum_eth * 100 / 112 + "%";
					document.getElementById('progress-amount-1').innerHTML = total_sum_eth.toFixed(3) + "Eth";
					document.getElementById('progress-amount-2').innerHTML = total_sum_euro.toFixed(3) + "€";
					document.getElementById('progress').style.width = total_sum_eth * 100 / 112 + "%";
					document.getElementById('pods-amount').innerHTML = quantity;
					var now = new Date();
					var distance = end - now;
					document.getElementById('countdown').innerHTML = Math.floor(distance / 60000);
				}).catch(err => console.log(err))
			}
			else {
				console.log('erro displaying progress')
			}
		})
	}

	timer = setInterval(progress_function, 30000);
} 