
var g_SvgGraph = function(){
	function MapTW(param){
		var map = param.map;
		var color = d3.scale.log().domain([param.minBound,param.maxBound]).range([param.minColor,param.maxColor]);
		var textInfo = param.textInfo;
		var titleInfo = param.titleInfo;
		map.SetData(param.data,color);
	  	map.OnHover(function(){
	  		if(map.GetHoverKey() != ""){
	  			var num = g_Util.NumberWithCommas(map.GetHoverValue());
	  			textInfo.text(map.GetHoverKey()+": "+num+param.unit);
	  		}
	  		else if(map.GetSelectKey() != ""){
	  			var num = g_Util.NumberWithCommas(map.GetSelectValue());
	  			textInfo.text(map.GetSelectKey()+": "+num+param.unit);
	  		}
	  		else{
	  			textInfo.text(param.unit);
	  		}
	  	});
	  	map.OnHoverOut(function(){
	  		if(map.GetSelectKey() != ""){
	  			var num = g_Util.NumberWithCommas(map.GetSelectValue());
	  			textInfo.text(map.GetSelectKey()+": "+num+param.unit);
	  		}
	  		else{
	  			textInfo.text(param.unit);
	  		}
	  	});
	  	map.OnClick(function(){
	  		titleInfo.text(map.GetSelectKey());
	  		if(param.clickFn) param.clickFn(map);
	  	});
	  	switch(param.type){
	  		case 1: map.DrawMapTW(param.selector,param.year); break;
	  		case 2: map.DrawSortBar(param.selector,param.maxBound); break;
	  	}
	  	
	  	if(map.GetSelectKey() != ""){
	  		var num = g_Util.NumberWithCommas(map.GetSelectValue());
	  		textInfo.text(map.GetSelectKey()+": "+num+param.unit);
	  	}
  	}

	var PopulationPyramid = function(param){
		if(param.data == null) return;

		var graph = $(param.selector);
		var w = graph.width(), h = graph.height();
		var svg = d3.select(param.selector);
		svg.selectAll("*").remove();
		var scaleW = d3.scale.linear().domain([0,param.pyramidScale]).range([0,w*0.5]);
		var scaleH = d3.scale.linear().domain([0,100]).range([0,h]);

		function HoverFn(item){
			if(item.empty()) return;
			hoverRect
				.attr("x",item.attr("x"))
				.attr("y",item.attr("y"))
				.attr("width",item.attr("width"))
				.attr("height",item.attr("height"));
			$(param.textInfo).text(item.attr("data-info"));
			if(param.hoverFn) param.hoverFn(item);
		}

		//console.log(param.data["男"]);
		var maleGroup = svg.append("g");
		maleGroup.selectAll("rect").data(param.data["男"])
			.enter().append("rect")
			.attr("data-hover", function(d){
				var str = d.minAge+"~"+d.maxAge+"-男";
				return str;
			})
			.attr("data-info",function(d){
				var num = g_Util.NumberWithCommas(d.count);
				if(d.minAge == d.maxAge) return d.minAge+"歲 男: "+num+" 人";
				else return d.minAge+"~"+d.maxAge+"歲 男: "+num+" 人";
			})
			.attr("width", function(d){return scaleW(d.count);})
			.attr("height", function(d){return scaleH(d.maxAge-d.minAge+1);})
			.attr("stroke","#ffffff")
			.attr("fill","#A1AFC9")
			.attr("x", function(d){return w*0.5-scaleW(d.count);})
			.attr("y", function(d){return h-scaleH(d.maxAge+1);})
			.on("mouseover",function(){
				HoverFn(d3.select(this));
			});

		var femaleGroup = svg.append("g");
		femaleGroup.selectAll("rect").data(param.data["女"])
			.enter().append("rect")
			.attr("data-hover", function(d){
				var str = d.minAge+"~"+d.maxAge+"-女";
				return str;
			})
			.attr("data-info",function(d){
				var num = g_Util.NumberWithCommas(d.count);
				if(d.minAge == d.maxAge) return d.minAge+"歲 女: "+num+" 人";
				else return d.minAge+"~"+d.maxAge+"歲 女: "+num+" 人";
			})
			.attr("width", function(d){return scaleW(d.count);})
			.attr("height", function(d){return scaleH(d.maxAge-d.minAge+1);})
			.attr("stroke","#ffffff")
			.attr("fill","#F47983")
			.attr("x", function(d){return w*0.5;})
			.attr("y", function(d){return h-scaleH(d.maxAge+1);})
			.on("mouseover",function(){
				HoverFn(d3.select(this));
			});

		var hoverRect = svg.append("rect").attr("class","hoverRect")
			.attr("stroke","#FFAA0D")
			.attr("stroke-width",2)
			.attr("fill","none");

		if(param.hover){
			var item = svg.select("rect[data-hover='"+param.hover+"']");
			HoverFn(item);
		}
	};

	var TimeLine = function(param){
		if(param.data == null) return;

		//compute scale
		var graph = $(param.selector);
		var w = graph.width(), h = graph.height();
		var svg = d3.select(param.selector);
		svg.selectAll("*").remove();
		var padL = param.padL||30,padR = param.padR||20,padT = param.padT||20,padB = param.padB||30;
		var scaleW = d3.scale.linear().domain([param.minTime,param.maxTime]).range([0,w-padL-padR]);
		var scaleH = d3.scale.linear().domain([param.maxValue,param.minValue]).range([0,h-padT-padB]);

		var line = d3.svg.line()
			.x(function(d) {return parseInt(scaleW(d[param.axisX]))+padL;})
			.y(function(d) {return parseInt(scaleH(d[param.axisY]))+padT;});

		//draw axis
		var xAxis = d3.svg.axis().orient("bottom").scale(scaleW).ticks(w/75)
			.tickFormat(function(d,i){
				if(i==0) return "";
				else return d;
			});
		var yAxis = d3.svg.axis().orient("left").scale(scaleH).ticks(10);
		var offsetY = param.alignZero?padT+scaleH(0):h-padB;
		var xAxisGroup = svg.append("g").call(xAxis)
			.attr({
				"font-size": "12px",
				"transform":"translate("+padL+","+offsetY+")",
  				"fill":"black",
  				"stroke":"black",
  				"stroke-width": 0.5
  			});
		xAxisGroup.select('path')
  			.style({ 'stroke': 'black', 'fill': 'none', 'stroke-width': '2px'});
		var yAxisGroup = svg.append("g").call(yAxis)
			.attr({
				"font-size": "12px",
				"transform":"translate("+padL+","+padT+")",
  				"fill":"black",
  				"stroke":"black",
  				"stroke-width": 0.5
  			});
		yAxisGroup.select('path')
  			.style({ 'stroke': 'black', 'fill': 'none', 'stroke-width': '2px'});

  		//time line & hover text
  		var timeLine = svg.append("line").attr("class","timeLine")
  			.attr("stroke","#cccccc")
  			.attr("x1",scaleW(param.time)+padL)
  			.attr("y1",padT)
  			.attr("x2",scaleW(param.time)+padL)
  			.attr("y2",h-padB);

		//draw data
		var lineStep = 20;
		var index = 0;
  		for(var key in param.data){
  			var curData = param.data[key];
  			var curColor = param.color[key];
  			//console.log(curData);
  			//console.log(line(curData));

  			var lineChart = svg.append("g");
			lineChart.append("path")
				.attr("fill", "none")
				.attr("stroke", curColor)
				.attr("stroke-linejoin", "round")
				.attr("stroke-linecap", "round")
				.attr("stroke-width", 1.5)
				.attr("d", line(curData));

			var circleGroup = svg.append("g").attr("class","circle"+key);
			circleGroup.selectAll("circle").data(curData)
				.enter().append("circle")
				.attr("data-info",param.infoFn)
				.attr("r",5)
				.attr("opacity",0)
				.attr("fill","white")
				.attr("stroke",curColor)
				.attr("stroke-width",0.5)
				.attr("cx", function(d){return padL+scaleW(d[param.axisX]);})
				.attr("cy", function(d){return padT+scaleH(d[param.axisY]);})
				.on("mouseover",function(){
					var cur = d3.select(this);
					cur.attr("opacity",1);
					$(param.textInfo).text(cur.attr("data-info"));
				})
				.on("mouseout",function(){
					d3.select(this).attr("opacity",0);
				});

			//var offsetY = h-padB-index*lineStep-20;
			var offsetY = padT+index*lineStep;
			svg.append("line")
				.attr("x1",w-padR-10)
				.attr("y1",offsetY)
				.attr("x2",w-padR)
				.attr("y2",offsetY)
				.attr("stroke-width",3)
				.attr("stroke",curColor);
			svg.append("text")
				.attr("x",w-padR-20)
				.attr("y",offsetY)
				.attr("text-anchor","end ")
				.attr("alignment-baseline","middle ")
				.attr("font-size","16px")
				.text(key);

			index++;
  		}

	};

	var PieChart = function(param){
		if(param.data == null) return;

		//compute scale
		var graph = $(param.selector);
		var w = graph.width(), h = graph.height();
		var svg = d3.select(param.selector);
		svg.selectAll("*").remove();

		var g = svg.append("g")
			.attr("class","group")
    		.attr("transform", "translate(" + w*0.5 + "," + h*0.5 + ")");
	
		var inRadius = param.inRadius?param.inRadius:0;
		var radius = Math.min(w,h)*0.5;
		var arc = d3.svg.arc()
		    .outerRadius(radius - 10)
		    .innerRadius(inRadius);

		var pie = d3.layout.pie()
		    .sort(null)
		    .value(function(d) { return d[param.value]; });
		var color = g_Util.ColorCategory(20);

		g.selectAll(".arc")
			.data(pie(param.data)).enter()
			.append("path")
			.attr("data-info",param.infoFn)
			.attr("class", "arc")
			.attr("d", arc)
			.attr("stroke","#FFFFFF")
			.attr("stroke-width",0)
			.attr("fill", function(d,i) { return color(i); })
			.on("mouseover",function(){
				var cur = d3.select(this);
				cur.attr("stroke-width",3);
				$(param.textInfo).text(cur.attr("data-info"));
			})
			.on("mouseout",function(){
				d3.select(this).attr("stroke-width",0);
			});

	};

	var Histogram = function(param){
		if(param.data == null) return;
		//compute scale
		var graph = $(param.selector);
		var w = graph.width(), h = graph.height();
		var svg = d3.select(param.selector);
		svg.selectAll("*").remove();
		var padL = 50,padR = 10,padT = 20,padB = 30;
		var minV = 1e10,maxV = 0;
		var scaleW = d3.scale.linear().domain([param.minX,param.maxX]).range([0,w-padL-padR]);
		var scaleH = d3.scale.linear().domain([param.maxValue,0]).range([0,h-padT-padB]);
		var color = d3.scale.linear().domain([param.maxValue*0.1,param.maxValue]).range([param.minColor,param.maxColor]);

		//draw axis
		var xAxis = d3.svg.axis().orient("bottom").scale(scaleW).ticks(w/75)
			.tickFormat(function(d){return d;});
		var yAxis = d3.svg.axis().orient("left").scale(scaleH).ticks(10)
			.tickFormat(function(d){return d;});
		var xAxisGroup = svg.append("g").call(xAxis)
			.attr({
				"font-size": "12px",
				"transform":"translate("+padL+","+(h-padB)+")",
  				"fill":"black",
  				"stroke":"black",
  				"stroke-width": 0.5
  			});
		xAxisGroup.select('path')
  			.style({ 'stroke': 'black', 'fill': 'none', 'stroke-width': '2px'});
		var yAxisGroup = svg.append("g").call(yAxis)
			.attr({
				"font-size": "12px",
				"transform":"translate("+padL+","+padT+")",
  				"fill":"black",
  				"stroke":"black",
  				"stroke-width": 0.5
  			});
		yAxisGroup.select('path')
  			.style({ 'stroke': 'black', 'fill': 'none', 'stroke-width': '2px'});

  		var g = svg.append("g").attr("class","histGroup");
  		g.selectAll("rect")
			.data(param.data).enter()
			.append("rect")
			.attr("data-info",param.infoFn)
			.attr("x",function(d){return scaleW(d[param.keyXMin])+padL;})
			.attr("y",function(d){return h-padB-scaleH(param.maxValue-d[param.keyY]);})
			.attr("width",function(d){return scaleW(d[param.keyXMax]-d[param.keyXMin]+1);})
			.attr("height",function(d){return scaleH(param.maxValue-d[param.keyY]);})
			.attr("stroke","#FFAA0D")
			.attr("stroke-width",0)
			.attr("fill", function(d) {return color(d[param.keyY]);})
			.on("mouseover",function(){
				var cur = d3.select(this);
				cur.attr("stroke-width",3);
				$(param.textInfo).text(cur.attr("data-info"));
			})
			.on("mouseout",function(){
				d3.select(this).attr("stroke-width",0);
			});
	}

	return {
		MapTW: MapTW,
		PopulationPyramid: PopulationPyramid,
		TimeLine: TimeLine,
		PieChart: PieChart,
		Histogram: Histogram
	}
}();