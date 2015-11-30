/**
 * Created with JetBrains WebStorm.
 * User: Emmanuel Meinike
 * Date: 29/09/13
 * Time: 13:40
 * To change this template use File | Settings | File Templates.
 */

var pieCanvas,barCanvas,results;

var topGreen = '#8ae234'
var frontGreen ='#73d216'
var sideGreen = '#4e9a06';

var topPurple = '#ad7fa8';
var frontPurple = '#75507b';
var sidePurple = '#5c3566';

var topGrey = '#babdb6';
var frontGrey ='#888a85';
var sideGrey ='#555753';
var canvasWidth;
var canvasHeight;


function InitCanvas(votes,barCanvasID,pieCanvasID){
    pieCanvas = document.getElementById(pieCanvasID).getContext('2d');
    barCanvas = document.getElementById(barCanvasID).getContext('2d');

    canvasHeight = document.getElementById(pieCanvasID).height;
    canvasWidth = document.getElementById(pieCanvasID).width;

    if(!votes){
        results =[];
        results[0] = 500;
        results[1] = 950;
        results[2] = 320;
    }else{
        results = votes;
    }



    drawPieChart(results,pieCanvas,false);
    drawBarChart(results,barCanvas,false);


    $('#barCanvas').mouseenter(function(){

        drawBarChart(results,barCanvas,true);
    });

    $('#barCanvas').mouseout(function(){

        drawBarChart(results,barCanvas,false);
    });

    $('#pieCanvas').mouseenter(function(){

        drawPieChart(results,pieCanvas,true);
    });

    $('#pieCanvas').mouseout(function(){

        drawPieChart(results,pieCanvas,false);
    });

    $('#barCanvasPublic').mouseenter(function(){

        drawBarChart(results,barCanvas,true);
    });

    $('#barCanvasPublic').mouseout(function(){

        drawBarChart(results,barCanvas,false);
    });

    $('#pieCanvasPublic').mouseenter(function(){

        drawPieChart(results,pieCanvas,true);
    });

    $('#pieCanvasPublic').mouseout(function(){

        drawPieChart(results,pieCanvas,false);
    });


}

function SetCanvasValues(votes){
    results = votes;
    updateCharts();
}

function updateCharts(){
    drawPieChart(results,pieCanvas,false);
    drawBarChart(results,barCanvas,false);
}

function drawBarChart(results,canvas,showPercentage){
    canvas.fillStyle ='#fafaf9';
    canvas.fillRect(0,0,canvasWidth,canvasHeight);


    var total=0;
    results.forEach(function(element){
        total += element;
    });


    var bottomY = 300;
    var leftX = 100;
    var barWidth = 40;
    var barSpacing = 100;
    var maxHeight = 280;

    var height1 = Math.round(results[0]*maxHeight/total);
    var height2 = Math.round(results[1]*maxHeight/total);
    //var height3 = Math.round(results[2]*maxHeight/total);

    drawGrid(canvas,bottomY,maxHeight,total);

    if(!showPercentage){
        drawBar(canvas,barWidth,height1,leftX,bottomY,topGreen,frontGreen,sideGreen,results[0]);
        drawBar(canvas,barWidth,height2,leftX+barSpacing,bottomY,topPurple,frontPurple,sidePurple,results[1]);
        //drawBar(canvas,(barWidth * 0.66),height3,leftX+(barSpacing*2),bottomY,topGrey,frontGrey,sideGrey,results[2]);
    }else{
        drawBar(canvas,barWidth,height1,leftX,bottomY,topGreen,frontGreen,sideGreen,Math.round(results[0]*100/total)+" %");
        drawBar(canvas,barWidth,height2,leftX+barSpacing,bottomY,topPurple,frontPurple,sidePurple,Math.round(results[1]*100/total)+" %");
        //drawBar(canvas,(barWidth * 0.66),height3,leftX+(barSpacing*2),bottomY,topGrey,frontGrey,sideGrey,Math.round(results[2]*100/total)+" %");
    }


}

function drawPieChart(results,canvas,showPercentage){
    canvas.fillStyle ='#fafaf9';
    canvas.fillRect(0,0,canvasWidth,canvasHeight);

    var total=0;
    results.forEach(function(element){
        total += element;
    });


    var x = canvasWidth/2;
    var y = canvasHeight/2;

    var radius = 90;

    var startAngle1 =toRadians(0);
    var endAngle1= startAngle1 + toRadians( Math.round(results[0]*360/total));

    var startAngle2= endAngle1;
    var endAngle2 = startAngle2 + toRadians(Math.round(results[1]*360/total));

    //var startAngle3= endAngle2;
    //var endAngle3 =startAngle3 + toRadians(Math.round(results[2]*360/total)+1);

    if(!showPercentage){


        drawPiePiece(canvas,radius,x,y,startAngle1,endAngle1,sideGreen,frontGreen,topGreen, ((results[0]/total*100 <= 5 ) ? "" : results[0]));
        drawPiePiece(canvas,radius,x,y,startAngle2,endAngle2,sidePurple,frontPurple,topPurple,((results[1]/total*100 <= 5 ) ? "" : results[1]));
        //drawPiePiece(canvas,radius,x,y,startAngle3,endAngle3,sideGrey,frontGrey,topGrey,((results[2]/total*100 <= 5 ) ? "" : results[1]));
    }else{

        drawPiePiece(canvas,radius,x,y,startAngle1,endAngle1,sideGreen,frontGreen,topGreen,((results[0]/total*100 <= 5 ) ? "" : Math.round(results[0]*100/total)+" %"));
        drawPiePiece(canvas,radius,x,y,startAngle2,endAngle2,sidePurple,frontPurple,topPurple,((results[1]/total*100 <= 5 ) ? "" : Math.round(results[1]*100/total)+" %"));
        //drawPiePiece(canvas,radius,x,y,startAngle3,endAngle3,sideGrey,frontGrey,topGrey,((results[2]/total*100 <= 5 ) ? "" : Math.round(results[2]*100/total)+" %"));
    }

     canvas.beginPath();
     canvas.moveTo(x,y);
     canvas.arc(x,y,25,toRadians(0), toRadians(360),false);
     canvas.fillStyle ="white";
     canvas.fill();

}

function toRadians(degrees){
  return (Math.PI/180) *degrees;
}

function toDegrees(radians){
  return (180/Math.PI) *radians;
}

function drawPiePiece(canvas,radius,x,y,startAngle,endAngle,firstColor,secondColor,thirdColor,value){

    var innerOffset = (35);
    var topOffset = 10;

    canvas.beginPath();
    canvas.moveTo(x,y);
    canvas.lineTo(x + (radius+ topOffset) * Math.cos(startAngle),y + (radius+topOffset) * Math.sin(startAngle));
    canvas.arc(x,y,(radius+topOffset),startAngle,endAngle,false);
    canvas.moveTo(x,y);
    canvas.lineTo(x + (radius+topOffset) * Math.cos(endAngle),y + (radius+topOffset) * Math.sin(endAngle));
    canvas.fillStyle =firstColor
    canvas.fill();


    canvas.beginPath();
    canvas.moveTo(x,y);
    canvas.lineTo(x + radius * Math.cos(startAngle),y + radius * Math.sin(startAngle));
    canvas.arc(x,y,radius,startAngle,endAngle,false);
    canvas.moveTo(x,y);
    canvas.lineTo(x + radius * Math.cos(endAngle),y + radius * Math.sin(endAngle));
    canvas.fillStyle =secondColor
    canvas.fill();


    canvas.beginPath();
    canvas.moveTo(x,y);
    canvas.lineTo(x + innerOffset * Math.cos(startAngle),y + innerOffset * Math.sin(startAngle));
    canvas.arc(x,y,innerOffset,startAngle,endAngle,false);
    canvas.moveTo(x,y);
    canvas.lineTo(x + innerOffset * Math.cos(endAngle),y + innerOffset * Math.sin(endAngle));
    canvas.fillStyle =thirdColor
    canvas.fill();


    canvas.fillStyle = '#555753';
    canvas.font = "bold 12px sans-serif";
    canvas.textAlign = "center";
    canvas.textBaseline = "bottom";

    var angle = toDegrees(startAngle);
    var angle2 = toDegrees(endAngle);
    var angle3 = Math.abs((angle - angle2)/2) + angle;

    if(parseInt(value)){
        if(value >=10000){
            value = Math.round(value/1000)+"K"
        }
    }


    canvas.fillText(value,x + (radius+40) * Math.cos(toRadians(angle3)),
                            y + (radius+40) * Math.sin(toRadians(angle3)));


}

function drawGrid(canvas,bottomY,height,total){

    canvas.fillStyle = '#555753';
    canvas.beginPath();
    canvas.moveTo(40,bottomY+1.5);
    canvas.lineTo(40, bottomY-height);
    canvas.moveTo(0,bottomY+1.5);
    canvas.lineTo(canvasHeight, bottomY+1.5);
    canvas.stroke();


    canvas.font = "bold 12px sans-serif";
    canvas.textAlign = "right";
    canvas.textBaseline = "bottom";
    canvas.fillText((total).toString(), 40,bottomY-height);
}

function drawBar(canvas,barWidth,barHeight,leftX,bottomY,topColor,frontColor,sideColor,value){

    //draw Front
    canvas.beginPath();
    canvas.moveTo(leftX,bottomY);
    canvas.lineTo(leftX,bottomY-barHeight);
    canvas.lineTo(leftX+barWidth,bottomY-barHeight);
    canvas.lineTo(leftX+barWidth,bottomY);
    canvas.lineTo(leftX,bottomY);
    canvas.fillStyle= frontColor;
    canvas.fill();

    //draw Side
    canvas.beginPath();
    canvas.moveTo(leftX+barWidth,bottomY-0.5);
    canvas.lineTo(leftX+barWidth +(barWidth/3),bottomY-(barWidth/3));
    canvas.lineTo(leftX+barWidth +(barWidth/3),bottomY-(barWidth/3) -barHeight);
    canvas.lineTo(leftX+barWidth,bottomY-0.5-barHeight);
    canvas.lineTo(leftX+barWidth,bottomY-0.5);
    canvas.fillStyle = sideColor;
    canvas.fill();

    //draw Top
    canvas.beginPath();
    canvas.moveTo(leftX,bottomY-barHeight);
    canvas.lineTo(leftX+ (barWidth/3),(bottomY-barHeight)-(barWidth/3));
    canvas.lineTo(leftX+ (barWidth/3) + barWidth ,(bottomY-barHeight)-(barWidth/3));
    canvas.lineTo(leftX+ barWidth,(bottomY-barHeight));
    canvas.lineTo(leftX,bottomY-barHeight);
    canvas.fillStyle = topColor;
    canvas.fill();



    //draw text

    canvas.fillStyle = '#555753';
    canvas.font = "bold 12px sans-serif";
    canvas.textAlign = "right";
    canvas.textBaseline = "bottom";
    if(parseInt(value)){
        if(value >=10000){
            value = Math.round(value/1000)+"K"
        }
    }
    canvas.fillText(value, leftX,bottomY-barHeight);

}