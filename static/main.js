
var g_APP = new Vue({
  el: "#app",
  data: {
  	curPage: 0,
    showRule: false,
    showGraph: false,
    showAbout: false
  },
  created: function () {
  	
  },
  methods: {
    UpdateGraph: function(){
      this.showRule = (this.curPage==1);
      this.showGraph = (this.curPage>1&&this.curPage<6);
      this.showAbout = (this.curPage==6);
      if(this.showGraph){
        setTimeout(function(){
          var title = $("#pageGraph").children(".title");
          switch(this.curPage){
            case 2: title.text("生の章"); break;
            case 3: title.text("老の章"); break;
            case 4: title.text("病の章"); break;
            case 5: title.text("死の章"); break;
          }
        }.bind(this),1);
      }
    },
    FlipPage: function(page){
      if(this.curPage == page) return;
      this.showRule = false;
      this.showGraph = false;
      this.showAbout = false;
      $('.death-note').attr("scrollTop", 0);

      var CoverOn = function(){
        $(".cover-top").css("width","calc(100% - 20px)");
        $("#coverContent").css("display","block");
        var btList = $("#coverButtonList");
        btList.children("img").css("opacity",0);
      }.bind(this);
      
      var CoverOff = function(){
        $(".cover-top").css("width","50px");
        $("#coverContent").css("display","none");
        setTimeout(function(){
          var btList = $("#coverButtonList");
          btList.children("img").css("opacity",1);
          this.UpdateGraph();
        }.bind(this),500);
      }.bind(this);

      var PageOn = function(){
        var pageMove = $(".page-move");
        pageMove.css("width","0px");
        pageMove.css("display","block");
        setTimeout(function(){
          pageMove.css("width","100%");
        },1);
        setTimeout(function(){
          pageMove.css("display","none");
          this.UpdateGraph();
        }.bind(this),500);
      }.bind(this);

      var PageOff = function(){
        var pageMove = $(".page-move");
        pageMove.css("width","100%");
        pageMove.css("display","block");
        setTimeout(function(){
          pageMove.css("width","0px");
        },1);
        setTimeout(function(){
          pageMove.css("display","none");
          this.UpdateGraph();
        }.bind(this),500);
      }.bind(this);

      if(page == 0) CoverOn();
      else if(this.curPage == 0 && page > 0) CoverOff();
      else if(this.curPage > page) PageOn();
      else if(this.curPage < page) PageOff();

      $("#coverButtonList :nth-child("+(this.curPage+1)+")").removeClass("select");
      $("#coverButtonList :nth-child("+(page+1)+")").addClass("select");
      this.curPage = page;
    }
  }
});


window.addEventListener('load', function() {
  var movie = d3.select("#svgAnim");
  var groupAll = movie.append("g").attr("id","groupAll");
  groupAll.attr("transform","scale(1.6,1.6) translate(30,0)");

  var groupTW = groupAll.append("g").attr("id","groupTW");
  groupTW.append("path").attr("id","pTW1")
    .attr("d","m 36.096725,67.24196 c 0,0 0.18899,-3.212791 1.889882,-6.80357 C 39.6875,56.847621 45.735118,44.941371 48.380951,41.539581 51.026784,38.137801 61.232142,27.74345 63.122024,23.7747 65.011906,19.80595 73.138392,11.67946 74.839285,10.92351 c 1.700892,-0.75595 7.559524,-0.56696 8.693454,-1.32291 1.133927,-0.75596 6.236605,-2.45685 6.236605,-2.45685 0,0 -3.401785,3.02381 -4.724702,4.53571 -1.322916,1.51191 -3.023809,0.94494 -6.236607,1.88988 -3.212796,0.94495 -8.504463,3.59078 -10.961309,7.55953 -2.456845,3.96875 -5.480654,7.74851 -9.449404,12.28422 -3.96875,4.535719 -9.827382,15.308042 -14.174108,21.35566 -4.346725,6.047621 -8.126489,12.47321 -8.126489,12.47321 z")
    .attr("fill","#ffffff");
  groupTW.append("path").attr("id","pTW2")
    .attr("d","m 96.194941,10.92351 c 0,0 6.236609,-2.26786 8.693449,-0.37797 2.45685,1.88988 8.31548,6.80357 7.37054,8.50446 -0.94494,1.70089 -8.69346,4.7247 -7.9375,6.99256 0.75595,2.26786 4.91369,10.772319 2.64583,13.98512 -2.26786,3.212801 -9.071427,11.717261 -9.071427,14.74107 0,3.023812 -4.535715,22.11161 -7.559524,27.970242 -3.023809,5.858629 -7.9375,20.599698 -10.205358,21.544638 -2.267857,0.94494 -9.071427,5.10268 -9.638392,8.69345 -0.566965,3.59078 -3.590774,14.74107 -3.779761,16.25298 -0.188989,1.5119 -3.590774,0 -3.590774,-1.51191 0,-1.5119 2.267857,-3.96875 2.267857,-5.29166 0,-1.32292 1.88988,-17.00893 3.96875,-18.89881 2.078869,-1.88988 6.425595,-3.590779 6.99256,-5.10268 0.566965,-1.511909 6.425594,-10.394349 7.559524,-14.930059 1.133927,-4.53572 9.071427,-26.458331 9.071427,-28.34821 0,-1.88989 -1.511903,-3.40179 -0.566965,-5.291672 0.944941,-1.889879 4.913691,-5.858629 5.291667,-8.504468 0.377978,-2.64583 4.346726,-6.61458 4.346726,-8.315471 0,-1.70089 -3.02381,-7.9375 -1.88988,-10.39435 1.13393,-2.45684 5.66964,-2.26785 4.7247,-4.91369 -0.94494,-2.64583 -1.88988,-5.29166 -4.15774,-5.48065 -2.267852,-0.18899 -4.535709,-1.32292 -4.535709,-1.32292 z")
    .attr("fill","#ffffff");
  groupTW.append("path").attr("id","pTW3")
    .attr("d","m 35.340774,71.021721 c 0,0 -7.181549,13.04018 -6.614584,17.00893 0.566966,3.96875 7.181549,21.355659 10.77232,23.812499 3.590774,2.45685 12.662204,6.80357 13.985121,10.20536 1.322917,3.40179 5.291667,7.18155 5.291667,7.18155 0,0 0.188987,-13.98512 -3.401788,-16.06399 C 51.782739,111.0872 43.845239,108.81934 39.49851,98.613992 35.151785,88.408632 33.072916,87.65268 34.206844,82.55 c 1.13393,-5.10268 1.13393,-11.528279 1.13393,-11.528279 z")
    .attr("fill","#ffffff");
  groupTW.append("path").attr("id","pTW4")
    .attr("d","m 45.723009,73.886181 c 0,0 6.748159,8.758298 16.601302,8.602029 10.058541,-0.159525 14.159933,-6.338335 14.159933,-6.338335 0,0 -4.612967,12.193483 -17.41509,10.563896 -8.946736,-1.138833 -13.346145,-12.82759 -13.346145,-12.82759 z")
    .attr("fill","#ffffff");
  groupTW.append("path").attr("id","pTW5")
    .attr("d","m 48.905335,79.534264 c 0,0 -2.428302,6.990053 -2.103566,11.153219 0.32474,4.163169 1.280308,6.429524 1.280308,6.429524 0,0 0.984428,-8.255381 1.823782,-10.42876 0.839351,-2.173378 2.55504,-4.684521 1.821226,-5.242538 -0.733816,-0.558016 -2.82175,-1.911445 -2.82175,-1.911445 z")
    .attr("fill","#ffffff");
  groupTW.append("path").attr("id","pTW6")
    .attr("d","m 73.380375,80.702703 c 0,0 -0.04651,7.343609 -1.756704,11.204708 -1.710191,3.861101 -3.381053,5.737586 -3.381053,5.737586 0,0 1.844246,-8.127748 1.778589,-10.435469 -0.06566,-2.307718 -0.85013,-5.189989 0.03488,-5.507704 0.885019,-0.317714 3.324282,-0.999121 3.324282,-0.999121 z")
    .attr("fill","#ffffff");

  var groupEye = groupTW.append("g").attr("id","groupEye");
  groupEye.append("path").attr("id","pEye1")
    .attr("d","m 65.314941,38.540411 c 0,0 -12.276973,4.980659 -10.574469,9.167225 3.168108,7.790575 23.176179,8.330615 26.92585,0.765286 1.343411,-2.710466 -6.506925,-6.609288 -6.506925,-6.609288 0,0 10.802546,3.506828 10.337519,7.551385 -0.732038,6.366893 -11.732603,9.014037 -18.610243,8.439089 C 60.594086,57.32807 51.54896,53.291429 51.623537,47.433542 c 0.06577,-5.16631 13.691404,-8.893131 13.691404,-8.893131 z")
    .attr("fill","#ffffff");
  groupEye.append("path").attr("id","pEye2")
    .attr("d","m 66.54764,52.340099 c 2.833301,0.596872 6.212746,-2.996447 6.641842,-6.171395 0.278788,-2.062798 -1.191796,-5.180682 -3.064358,-5.246113 -2.956432,-0.103307 -5.091033,4.642973 -5.294961,7.928584 -0.08212,1.323056 0.547151,3.242378 1.717477,3.488924 z")
    .attr("fill","#ff0000");

  var groupSickle = groupTW.append("g").attr("id","groupSickle");
  groupSickle.append("path").attr("id","pSickle1")
    .attr("d","m 0.56218712,21.542094 c 0,0 -7.24965902,12.161192 -10.25192572,27.199405 -5.2796464,26.445503 1.6729314,44.126858 1.6729314,44.126858 0,0 1.4399899,-21.054682 6.1947061,-39.217995 C 2.5362524,37.001181 15.092692,35.207607 13.395409,30.917355 11.698125,26.627103 0.56218712,21.542094 0.56218712,21.542094 Z")
    .attr("fill","#ffffff");
  groupSickle.append("path").attr("id","pSickle2")
    .attr("d","m 1.9189051,20.172961 c 0,0 -2.08237012,3.15489 -1.0569765,9.492508 0.6711465,4.148134 16.1648414,12.945099 33.8065384,23.689759 l 1.880236,-4.805174 C 18.947918,34.927732 1.9189051,20.172961 1.9189051,20.172961 Z m 93.0235879,65.041764 -1.14268,4.846626 c 17.793547,10.785809 35.293897,22.211149 35.558237,23.501629 0.42908,2.09467 9.47954,-1.66901 8.62139,-5.85833 -0.54608,-2.66589 -22.58291,-12.41225 -43.036947,-22.489925 z")
    .attr("fill","#ffffff");

  function SickleAnimLoop(){
    groupSickle.transition()
      .duration(2000)
      .ease("easeSin")
      .attr("transform","rotate(10,60,70)")
      .transition()
      .duration(2000)
      .ease("easeSin")
      .attr("transform","rotate(0,60,70)")
      .each("end",function(){
        SickleAnimLoop();
      });
  }
  SickleAnimLoop();

  function TWAnimLoop(){
    groupTW.transition()
      .duration(2000)
      .ease("easeSin")
      .attr("transform","translate(0,5)")
      .transition()
      .duration(2000)
      .ease("easeSin")
      .attr("transform","translate(0,0)")
      .each("end",function(){
        TWAnimLoop();
      });
  }
  TWAnimLoop();
  
  movie.on("mousemove", function(){
    var coord = d3.mouse(this);
    var eyeBall = d3.select("#pEye2");
    var eyeBox = eyeBall.node().getBBox();
    var centerX = eyeBox.x+eyeBox.width*0.5;
    var centerY = eyeBox.y+eyeBox.height*0.5;
    var diffX = coord[0]-centerX;
    var diffY = coord[1]-centerY;
    var norm = Math.sqrt(diffX*diffX+diffY*diffY);
    if(norm == 0) return;
    diffX /= norm;
    diffY /= norm;
    var radius = 3;
    eyeBall.transition().ease("linear").duration(100)
      .attr("transform","translate("+diffX*radius+","+diffY*radius+")");
  });
  movie.on("mouseout", function(){
    var eyeBall = d3.select("#pEye2");
    eyeBall.transition().ease("linear").duration(200)
      .attr("transform","translate(0,0)");
  });
});
