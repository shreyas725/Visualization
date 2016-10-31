var result = {};
var divider = 10;

document.getElementById('download').addEventListener('click', downloadClick);

if(jsonData){
	buildMainChart(jsonData);
	buildSubChart(jsonData, result);
}

function downloadClick(){
	var xmlhttp = new XMLHttpRequest();
	var url = document.getElementById('downloadAdress').value;

	xmlhttp.onreadystatechange = function() {
	    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
	        jsonData = JSON.parse(xmlhttp.responseText);
	        buildMainChart(jsonData);
	        buildSubChart(jsonData, result);
	    }
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}

function buildMainChart(jsonData){
	$("#mainChartBlock *").remove();
	$("#mainChartBlock").append('<canvas id="mainChart" width="740" height="400" style="width: 740px; height: 400px;"></canvas><br>');
	var ctx = document.getElementById("mainChart").getContext("2d");

	result.labels = new Array();
	result.datasets = [{
		label: "Crashes amount",
        fillColor: "rgba(151,187,205,0.5)",
        strokeColor: "rgba(151,187,205,0.8)",
        highlightFill: "rgba(151,187,205,0.75)",
        highlightStroke: "rgba(151,187,205,1)",
	    data: new Array()
	}];
	for(var i = 0; i < jsonData.length; i++){
		if(result.labels.indexOf(jsonData[i].current_page) == -1){
			result.labels.push(jsonData[i].current_page);
			result.datasets[0].data[result.labels.indexOf(jsonData[i].current_page)] = 0;
		}
		if(jsonData[i].did_aww_snap)
			result.datasets[0].data[result.labels.indexOf(jsonData[i].current_page)]++;
	}

	var mChart = new Chart(ctx).Bar(result);
}

function buildSubChart(jsonData, previous){
	var formattedData = {};
	for(var i = 0; i < previous.labels.length; i++){
		formattedData[previous.labels[i]] = {};
		formattedData[previous.labels[i]].data = new Array();
	}
	createTabs();

	for(var i = 0; i < jsonData.length; i++){
		formattedData[jsonData[i].current_page].data.push(jsonData[i]);
		if(formattedData[jsonData[i].current_page].min === undefined || jsonData[i].timestamp <= formattedData[jsonData[i].current_page].min){
			formattedData[jsonData[i].current_page].min = jsonData[i].timestamp;
		}
		if(formattedData[jsonData[i].current_page].max === undefined || jsonData[i].timestamp >= formattedData[jsonData[i].current_page].max){
			formattedData[jsonData[i].current_page].max = jsonData[i].timestamp;
		}
	}

	for(var key in formattedData){
		var step = (formattedData[key].max - formattedData[key].min) / divider;
		formattedData[key].chartData = new Array();
		for(var i = 0; i <= divider; i++){
			formattedData[key].chartData[i] = 0;
		}
		for(var i = 0; i < formattedData[key].data.length; i++){
			var index = Math.floor((formattedData[key].data[i].timestamp - formattedData[key].min) / step);
			formattedData[key].chartData[index]++;
		}
	}

	drawLineCharts();
	$("#nav1Content div").removeClass('active');
	$("#nav1Content div:first-child").addClass('active');


	function createTabs(){
		$('#nav1 *').remove();
		$("#nav1Content *").remove();
		for(var i = 0; i < previous.labels.length; i++){
			var tab = '<li role="presentation"><a href="#tab' + i + '" aria-controls="tab' + i + '1" role="tab" data-toggle="tab">' + previous.labels[i] + '</a></li>';
			$("#nav1").append(tab);
			var tabContent = '<div role="tabpanel" class="tab-pane active" id="tab' + i + '"><canvas id="tabChart' + i + '" width="740" height="400" style="width: 740px; height: 200px;"></canvas></div>';
			$("#nav1Content").append(tabContent);
		}
		$("#nav1 li:first-child").addClass('active');
		$('#nav1 a').click(function (e) {
		  e.preventDefault()
		  $(this).tab('show')
		})
	}

	function drawLineCharts(){
		var charts = new Array();
		var cvs = 0;
		for(var key in formattedData){
			var chartData = {};
			chartData.labels = new Array();
			var step = (formattedData[key].max - formattedData[key].min) / divider;
			for(var i = 0; i < divider; i++){
				chartData.labels.push(((step * i) / 60000).toFixed(2) + ' mins');
			}
			chartData.datasets = [{
				label: "My First dataset",
	            fillColor: "rgba(240,0,0,0.2)",
	            strokeColor: "rgba(240,0,0,0.2)",
	            pointColor: "rgba(240,0,0,0.2)",
	            pointStrokeColor: "#fff",
	            pointHighlightFill: "#fff",
	            pointHighlightStroke: "rgba(240,0,0,0.2)",
	            data: formattedData[key].chartData
			}];
			var ctx = document.getElementById('tabChart' + cvs++).getContext("2d");
			charts.push(new Chart(ctx).Line(chartData));
		}

	}
}