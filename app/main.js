function seleciona(chart) {
    var charts = {"1": "chart1", "2": "chart2", "3": "chart3", "4": "chart4", "5": "chart5",
        "6": "chart6", "7": "chart7", "8": "chart8", "9": "chart9", "10": "chart10"};
    var selectedChart;
    var hiddenChart;
    for (var c in charts) {
        if (chart === c) {
            document.getElementById(c).className += "btn-selected";
            selectedChart = document.getElementById(charts[c]);
            selectedChart.style.display = "block";
        } else {
            document.getElementById(c).className = document.getElementById(c).className.split("btn-selected").join("");
            hiddenChart = document.getElementById(charts[c]);
            hiddenChart.style.display = "none";
        }
    }

    limpa();
    plot(charts[chart]);
}

function limpa() {
    var tam = document.getElementsByClassName("row").length;
    for (var i = 1; i < tam; i++) {
        document.getElementsByClassName("row")[i].remove();
    }
}

function getImageSrc(name) {

    var src = "../img/";

    for (var i = 0; i < name.length; i++) {
        if (name[i] === " ") {
            src = src + "_";
        } else {
            src = src + name[i];
        }
    }

    src = src + ".jpg";
    return src;
}

function myId(name) {

    var id = "";

    for (var i = 0; i < name.length; i++) {
        if (name[i] === " ") {
            id = id + "-";
        } else {
            id = id + name[i];
        }
    }

    return id.toLowerCase();
}




function topLeadActress() {

    d3.csv("oscar_data.csv", function (error, data) {

        if (error) throw error;

        var actresses = {};

        data.forEach(function (d) {

            function isLeadActress(d) {
                return d.categoria === "Actress -- Leading Role";
            }
            function won(d) {
                return d.venceu === "YES"
            }

            if (isLeadActress(d) && won(d)) {
                var name = d.atribuicao;
                if (!actresses[name]) actresses[name] = 1;
                else ++actresses[name];
            }
        }); // end for

        var topActresses = [];
        for (var actress in actresses) {
            topActresses.push([actress, actresses[actress]]);
        }
        topActresses.sort(function(a, b) {
            return -a[1] + b[1];
        });

        plotTop10LeadActress(topActresses);

    });
}

function plotTop10LeadActress(orderedActresses) {

    var width = 1210;
    var height = 1210;

    var svg_best_actress = d3.select("#" + "best-actress")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    var top10LeadActress = getTop10LeadActress(orderedActresses);

    var name = 0;
    for (var i = 0; i < 10; i++) {

        var actress = top10LeadActress[i][name];
        plotLeadActress(actress, svg_best_actress, i);
    }
}

function getTop10LeadActress(orderedActresses) {

    var top10LeadActress = [];
    for (var i = 0; i < 10; i++) {
        top10LeadActress.push(orderedActresses[i]);
    }

    return top10LeadActress;
}

function plotLeadActress(actress, svg, i) {

    var src = getImageSrc(actress);
    var id = myId(actress);

    var y = (i % 10) * 110;
    var x = Math.floor(i / 10) * 110;
    var size = 110;
    var padding_circle = 2;

    var section = svg.append("svg")
        .attr("class", "section")
        .attr("margin","50px 50px");

    var defs =  section
        .append('svg:defs');

    var image = defs
        .append("svg:pattern")
        .attr("id", id)
        .attr('patternUnits', 'userSpaceOnUse')
        .attr("width", size)
        .attr("height", size)
        .append("svg:image")
        .attr("xlink:href", src)
        .attr("width", size)
        .attr("height", size);

    var circle = section
        .append("svg:circle")
        .attr("cx", x + size / 2)
        .attr("cy", y + size / 2)
        .attr("r", size/2 - padding_circle)
        .style("fill", "url(#"+ id +")")
        .attr("stroke", "#E0E3DC")
        .attr("stroke-width", 3);
}











