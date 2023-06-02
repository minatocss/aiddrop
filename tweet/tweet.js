let filter = ''
let images = {"Early Supporter": "633344f6fc0ce323cf6aa045/638f7b8ba8b0110ca8d5667c_Aiddrop_Early-Supporter.png",
    "welfare":"633404a85e0aa0228a89447f/63345aa317f50bdc0e25b3d1_Welfare_front.png",
    "Education":"63345a68899f5f52342d8dfb_Education_front.png",
    "Art & Culture":"63345a47025f04c0a882446a_Art-and-Culture_front.png",
    "Children & Youth":"63345a259648453c8728e048_Children-and-Youth_front.png",
    "Mental & Health":"633404a85e0aa0228a89447f/63345a030ea375252d30937d_Mental-and-Health_front.png",
    "Religion":"633404a85e0aa0228a89447f/633459b84710a36dfc5f41fa_Religion_front.png",
    "Tech & Science":"633404a85e0aa0228a89447f/633459739910d8e2fd26caea_Tech-and-Science_front.png",
    "Environment": "633404a85e0aa0228a89447f/63340cf6275ca3248d456171_Environment_front.png",
    "Equal Access":"633404a85e0aa0228a89447f/63340afb696b09bb61cdf4ab_Equal-Access_front.png",
    "Refugees & Migration":"633404a85e0aa0228a89447f/635a4597452f5c16062b75c2_Refugees-and-Migration_front.png",
    "No Racism":"635a46c2452f5ca1ab2c2272_NO-Racism_front.png",
    "Emergency & Disaster":"633344f6fc0ce323cf6aa045/63340617dfa93b5dfcbc7d72_Emergency-and-Desasters_front.png",
    "LGBTQIA+": "633404a85e0aa0228a89447f/635a4845926b470e33aec879_LGBTQIA%2B_front.png",
    "Animals":"633404a85e0aa0228a89447f/635a4882b5904b1ac9badec9_Animals_front.png",
    "Economic Development":"633404a85e0aa0228a89447f/635a48bee410e653607c65ad_Economic-Development_front.png",
    "Food & Water": "633404a85e0aa0228a89447f/635a491f0bf1f41e6a025ac8_Food-and-Water_front.png",
    "Crypto Adoption":"633404a85e0aa0228a89447f/635a4966d1fa1949a2a46828_Crypto-Adoption_front.png",
    "Women & Girls":"633404a85e0aa0228a89447f/635a49a6dd15ce3c0a876e3a_Women-and-Girls_front.png",
    "Family & Home":"633404a85e0aa0228a89447f/635a49f1e4d04877e7b45647_Family-and-Home_front.png",
    "Rights & Justice":"633404a85e0aa0228a89447f/635a4a30de3d85421e500f6d_Rights-and-Justice_front.png",
    "Sports":"633404a85e0aa0228a89447f/635a4a5bd1fa1917d8a4ed0b_Sports_front.png",
    "Local Tradition":"633404a85e0aa0228a89447f/635a4a8a55e8162ba7ebcf28_Local-Tradition_front.png",
    "Democracy": "633404a85e0aa0228a89447f/635a4ab8e95430814097c0d7_Democracy_front.png",
    "Earthquake Aid Turkey/Syria": "633404a85e0aa0228a89447f/63e25b204133e90af1801fe9_Earthquake-aid_Turkey-Syria_front.png",}
let processed_data = [];
let donations_interval = [-10, -1];
getting_data = async () => {
	await fetch("https://api.apispreadsheets.com/data/2gzcoSyeACuKfuAJ/").then(res => {
		if (res.status === 200) {
			res.json().then(data => {
				const donations_data = data
				const donations = donations_data['data'];
				let dict = {}
				donations.forEach((d) => {
        	if(!d['Mission'].includes(filter)){return}
					if (dict[d['Address']]) {
						dict[d['Address']]['EthAmount'] = (parseFloat(d['EthAmount']) + parseFloat(dict[d['Address']]['EthAmount'])).toFixed(3);
						dict[d['Address']]['Euro'] = (parseFloat(dict[d['Address']]['Euro']) + parseFloat(d['EthAmount']) * parseFloat(d['ConversionRate'])).toFixed(2);
            if(dict[d['Address']]['Tweeter'] == ''){dict[d['Address']]['Tweeter'] = d['Tweeter']}
            if(dict[d['Address']]['Missions'].length <  5 && ! dict[d['Address']]['Missions'].includes(d['Mission'])){dict[d['Address']]['Missions'].push(d['Mission'])};
					} else {
						dict[d['Address']] = {
							'Address': d['Address'],
							'EthAmount': parseFloat(d['EthAmount']).toFixed(3),
							'Euro': (parseFloat(d['EthAmount']) * parseFloat(d['ConversionRate'])).toFixed(2),
							'Tweeter': d['Tweeter'],
              'Missions': [d['Mission']]
						}
					}
				});
				processed_data = Object.values(dict)
        if(processed_data.length == 0){
        	document.getElementById('table-overlay').style['display'] =''
          document.getElementById('donate-link').href = 'mission/' + filter.replace(/\s/g, '-').replace('-&', '').toLowerCase()
          document.getElementById('table-header').style['display'] ='None'
        document.getElementById('table-paginator').style['display'] ='None'
        }else{document.getElementById('table-overlay').style['display'] ='None';
        document.getElementById('table-header').style['display'] =''
        document.getElementById('table-paginator').style['display'] =''}
				processed_data.sort((a, b) => {
					if (parseFloat(a['Euro']) > parseFloat(b['Euro'])) {
						return -1;
					}
					if (parseFloat(a['Euro']) < parseFloat(b['Euro'])) {return 1;}
					return 0;
				})
        insert_data_next();
			}).catch(err => console.log(err))
		}
		else {
			console.log('erro displaying progress')
		}
	})
}
let insert_data_next = function () {
	if (donations_interval[1] >= processed_data.length)
		return
	donations_interval = [donations_interval[0] + 10, donations_interval[1] + 10]
	for (var i = 1; i <= 10; i++) {
  	if(processed_data[donations_interval[0] + i - 1] == undefined){
    	document.getElementById('tab-' + i).style['display'] = 'None'
      continue;
    }
  	if(processed_data[donations_interval[0] + i - 1]['Tweeter'].replace('@', '') == '') {document.getElementById('twitterl-' + i).style['visibility'] = 'hidden'}
    else { let link = 'https://www.twitter.com/' + processed_data[donations_interval[0] + i - 1]['Tweeter'].replace('@', '');
    document.getElementById('twitterl-' + i).onclick = () => {window.open(link, '_blank').focus()}}
		document.getElementById('address-' + i).innerHTML = processed_data[donations_interval[0] + i - 1]['Address']
		document.getElementById('euro-' + i).innerHTML = processed_data[donations_interval[0] + i - 1]['Euro']
		document.getElementById('eth-' + i).innerHTML = parseFloat(processed_data[donations_interval[0] + i - 1]['EthAmount'])
		document.getElementById('mission-images-' + i).innerHTML = ''
    document.getElementById('tab-' + i).style['display'] = ''
    processed_data[donations_interval[0] + i - 1]['Missions'].forEach(name => {
    	document.getElementById('mission-images-' + i).innerHTML += '<img loading="lazy" sizes="30px" srcset=https://uploads-ssl.webflow.com/' + images[name] + ' 500w, https://uploads-ssl.webflow.com/' + images[name] + ' 800w, https://uploads-ssl.webflow.com/' + images[name] + ' 1001w" alt="" src=https://uploads-ssl.webflow.com/'+ images[name] + '>'
    })
    if (donations_interval[0]+i <= 3) {
			document.getElementById('rank-1').innerHTML = '<img loading="lazy" alt="1" src="https://uploads-ssl.webflow.com/633344f6fc0ce323cf6aa045/6388d2f5ab22f10eb3673080_rank%2001.svg">';
			document.getElementById('rank-2').innerHTML = '<img loading="lazy" alt="2" src="https://uploads-ssl.webflow.com/633344f6fc0ce323cf6aa045/6388d2f5dd29b8fe46e3afc3_rank%2002.svg">';
			document.getElementById('rank-3').innerHTML = '<img loading="lazy" alt="3" src="https://uploads-ssl.webflow.com/633344f6fc0ce323cf6aa045/6388d2f6488dacd83f3cc76b_rank%2003.svg">';
		} else {
			document.getElementById('rank-' + i).innerHTML = parseInt(donations_interval[0] + i);
		}
	}
}

let insert_data_prev = function () {
	if (donations_interval[0] <= 0)
		return
	donations_interval = [donations_interval[0] - 10, donations_interval[1] - 10]
	for (var i = 1; i <= 10; i++) {
  	if(processed_data[donations_interval[0] + i - 1]['Tweeter'].replace('@', '') == '') {document.getElementById('twitterl-' + i).style['visibility'] = 'hidden'}
    else {let link = 'https://www.twitter.com/' + processed_data[donations_interval[0] + i - 1]['Tweeter'].replace('@', '');
    document.getElementById('twitterl-' + i).onclick = () => {window.open(link, '_blank').focus()}}
		document.getElementById('address-' + i).innerHTML = processed_data[donations_interval[0] + i - 1]['Address']
		document.getElementById('euro-' + i).innerHTML = processed_data[donations_interval[0] + i - 1]['Euro']
		document.getElementById('eth-' + i).innerHTML = parseFloat(processed_data[donations_interval[0] + i - 1]['EthAmount'])
    document.getElementById('mission-images-' + i).innerHTML = ''
    document.getElementById('tab-' + i).style['display'] = ''
    processed_data[donations_interval[0] + i - 1]['Missions'].forEach(name => {
    	document.getElementById('mission-images-' + i).innerHTML += '<img loading="lazy" sizes="30px" srcset=https://uploads-ssl.webflow.com/' + images[name] + ' 500w, https://uploads-ssl.webflow.com/' + images[name] + ' 800w, https://uploads-ssl.webflow.com/' + images[name] + ' 1001w" alt="" src=https://uploads-ssl.webflow.com/'+ images[name] + '>'
    })
		if (donations_interval[0]+i <= 3) {
document.getElementById('rank-1').innerHTML = '<img loading="lazy" alt="1" src="https://uploads-ssl.webflow.com/633344f6fc0ce323cf6aa045/6388d2f5ab22f10eb3673080_rank%2001.svg">';
document.getElementById('rank-2').innerHTML = '<img loading="lazy" alt="2" src="https://uploads-ssl.webflow.com/633344f6fc0ce323cf6aa045/6388d2f5dd29b8fe46e3afc3_rank%2002.svg">';
document.getElementById('rank-3').innerHTML = '<img loading="lazy" alt="3" src="https://uploads-ssl.webflow.com/633344f6fc0ce323cf6aa045/6388d2f6488dacd83f3cc76b_rank%2003.svg">';
		}else{document.getElementById('rank-' + i).innerHTML = parseInt(donations_interval[0] + i);}
	}
}
let start_document = async function(){await getting_data();
document.getElementById('next-btn').onclick = insert_data_next;
document.getElementById('prev-btn').onclick = insert_data_prev;
}
start_document();
document.getElementById("Mission-filter").onchange = function(){
processed_data = [];
donations_interval = [-10, -1];
filter = document.getElementById("Mission-filter").value;
start_document();}