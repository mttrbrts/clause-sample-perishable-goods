const API_HOST = 'https://composer-rest-server-cicero-perishable-network.mybluemix.net/api';

$(document).ready(function() {

	// // fix menu when passed
	// $('.masthead')
	// .visibility({
	//   once: false,
	//   onBottomPassed: function() {
	// 	$('.fixed.menu').transition('fade in');
	//   },
	//   onBottomPassedReverse: function() {
	// 	$('.fixed.menu').transition('fade out');
	//   }
	// });

	// // create sidebar and attach to menu open
	// $('.ui.sidebar')
	// 	.sidebar('attach events', '.toc.item')
	// ;

	//
	resetDemo();  

	$('#newTemp').range({
		min: -20,
		max: 60,
		start: newTemp,
		onChange: function(val) { 
			newTemp = val;
			$('#display-temp').html(val);
		}
	});

	$('#newHumidity').range({
		min: 0,
		max: 100,
		start: newHumidity,
		onChange: function(val) { 
			newHumidity = val; 
			$('#display-humidity').html(val);
		}
	});

	$('.message .close')
	.on('click', function() {
	  $(this)
		.closest('.message')
		.transition('fade')
	  ;
	});
})

var step = 0;
var newTemp = 5;
var newHumidity = 53;
var readings = [];
var shipmentName='SHIP_001';

function addReading(){
	console.log('add reading');
	console.log('temp:', newTemp);
	console.log('humidity:', newHumidity);

	$( '.ui.fluid.card:last' ).after(`
		<div class="ui fluid card">
			<div class="content">
			<div class="header">${new Date()}</div>
				<div class="meta">74972368f01cf55025d9332005b2f659</div>
				<div class="description">
					<div class="ui teal progress" data-percent="${newTemp}" id="temp${readings.length}">
						<div class="bar"></div>
						<div class="label">Temperature</div>
					</div>
					<div class="ui orange progress" data-percent="${newHumidity}" id="humidity${readings.length}">
						<div class="bar"></div>
						<div class="label">Humidity</div>
					</div>
				</div>
			</div>
		</div>
	`);

	$( "#temp"+readings.length ).progress();
	$( "#humidity"+readings.length ).progress();

	readings.push({temp:newTemp, humidity:newHumidity});
}

function resetDemo() {

	console.log('resetting demo');
	$( "#step1segment" ).show();
	$( "#step2segment, #step3segment, #step4segment" ).hide();


	$( "#step1, #step2, #step3, #step4" ).removeClass( "completed active" );
	$( "#step1" ).addClass( "active" );
	step = 0;

}

function setupDemo(){
	console.log('calling setup demo api');
	
	ajaxSettings.method = 'POST';
	ajaxSettings.url = API_HOST + '/SetupDemo';
	ajaxSettings.data = JSON.stringify({
		"$class": "org.accordproject.perishablegoods.SetupDemo"
	});
	
	$.ajax(ajaxSettings).done(function (response) {
		console.log(response);
	});
}

function undoSetupDemo() {
	//DELETE https://composer-rest-server-cicero-perishable-network.mybluemix.net/api/Shipment/SHIP_001
	ajaxSettings.method = 'DELETE';
	ajaxSettings.url = API_HOST + '/Shipment/SHIP_001';
	
	$.ajax(ajaxSettings).done(function (response) {
		console.log(response);
	});

	//DELETE https://composer-rest-server-cicero-perishable-network.mybluemix.net/api/Grower/farmer%40email.com
	ajaxSettings.url = API_HOST + '/Grower/farmer%40email.com';
	
	$.ajax(ajaxSettings).done(function (response) {
		console.log(response);
	});

	//DELETE https://composer-rest-server-cicero-perishable-network.mybluemix.net/api/Importer/supermarket%40email.com
	ajaxSettings.url = API_HOST + '/Importer/supermarket%40email.com';
	
	$.ajax(ajaxSettings).done(function (response) {
		console.log(response);
	});

	//DELETE https://composer-rest-server-cicero-perishable-network.mybluemix.net/api/Shipper/shipper%40email.com
	ajaxSettings.url = API_HOST + '/Shipper/shipper%40email.com';
	
	$.ajax(ajaxSettings).done(function (response) {
		console.log(response);
	});
}

function sendSensorReading(temp, humidity, cb){

	ajaxSettings.method = 'POST';
	ajaxSettings.url = API_HOST + '/SensorReading';
	ajaxSettings.data = JSON.stringify({
		"$class": "org.accordproject.perishablegoods.SensorReading",
		"centigrade": temp,
		"humidity" : humidity,
		"shipment": "resource:org.accordproject.perishablegoods.Shipment#"+shipmentName,
	});
	
	$.ajax(ajaxSettings).done(cb);
}

function nextStep() {
	console.log('next step clicked');
	switch (step) {
		case 0:
			$( "#step1segment" ).hide();
			$( "#step2segment" ).show();
			$( "#step1" ).removeClass( "active" );
			$( "#step1" ).addClass( "completed" );
			$( "#step2" ).addClass( "active" );
			break;
		case 1:
			$( "#step2segment" ).hide();
			$( "#step3segment" ).show();
			$( "#step2" ).removeClass( "active" );
			$( "#step2" ).addClass( "completed" );
			$( "#step3" ).addClass( "active" );
			break;
		case 2:
			$( "#step3segment" ).hide();
			$( "#step4segment" ).show();
			$( "#step3" ).removeClass( "active" );
			$( "#step3" ).addClass( "completed" );
			$( "#step4" ).addClass( "active" );
			break;
		default:
			resetDemo();
	}
	step += 1;
}

function backStep() {

	console.log('back step clicked');
	switch (step) {
		case 1:
			$( "#step2segment" ).hide();
			$( "#step1segment" ).show();
			$( "#step2" ).removeClass( "active" );
			$( "#step1" ).addClass( "active" );
			break;
		case 2:
			$( "#step3segment" ).hide();
			$( "#step2segment" ).show();
			$( "#step3" ).removeClass( "active" );
			$( "#step2" ).addClass( "active" );
			break;
		case 3:
			$( "#step4segment" ).hide();
			$( "#step3segment" ).show();
			$( "#step4" ).removeClass( "active" );
			$( "#step3" ).addClass( "active" );
			break;
		default:
			resetDemo();
	}
	step -= 1;
}

var ajaxSettings = {
	"async": true,
	"crossDomain": true,
	"headers": {
	  "Content-Type": "application/json",
	},
	"processData": false,
	error: function(jqXHR, textStatus, errorThrown) {
		$('#errorMessage > p').html(JSON.parse(jqXHR.responseText).error.message);
		$('#errorMessage').show();
	},
}