
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

    ids = [ "best-films", "best-actress", "best-actor", "supporting-actress", "supporting-actor" ];

    var content = d3.select(".content");
    for (var i = 0; i < ids.length; i++) {
        document.getElementById(ids[i]).remove();
        content.append("div").attr("id", ids[i]);
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

    limpa();

    d3.csv("oscar_data.csv", function (error, data) {

        if (error) throw error;

        var actresses = {};
        var nominations = {};

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

            } else if (isLeadActress(d) && !won(d)) {
                var name = d.atribuicao;
                if (!nominations[name]) nominations[name] = 1;
                else ++nominations[name];
            }
        }); // end for

        var topActresses = [];
        for (var actress in actresses) {
            topActresses.push([actress, actresses[actress]]);
        }
        topActresses.sort(function(a, b) {
            return -a[1] + b[1];
        });


        var topNominations = [];
        for (var actress in nominations) {
            topNominations.push([actress, nominations[actress]]);
        }
        topNominations.sort(function(a, b) {
            return -a[1] + b[1];
        });

        console.log(topNominations);

        plotTop10LeadActress(topActresses);
        plotTop10Nominations(topNominations);

    });
}

function plotTop10LeadActress(orderedActresses) {

    var div_best_actress = d3.select("#" + "best-actress")
        .attr("class", "col-lg-1");

    var first_group = div_best_actress
        .append("div")
        .attr("class", "first_group");

    var second_group = div_best_actress
        .append("div")
        .attr("class", "second_group");

    var groups = [first_group, second_group];

    var top10LeadActress = getTop10Actress(orderedActresses);

    var name = 0;
    for (var i = 0; i < 10; i++) {
        var my_div_group = (i % 2 === 0) ? groups[0] : groups[1];

        var actress = top10LeadActress[i][name];
        plotLeadActress(actress, my_div_group, i);
    }
}

function plotTop10Nominations(orderedActresses) {

    var div_best_actress = d3.select("#" + "best-actress")
        .attr("class", "col-lg-1");

    var third_group = div_best_actress
        .append("div")
        .attr("class", "third_group");

    var fourth_group = div_best_actress
        .append("div")
        .attr("class", "fourth_group");

    var groups = [third_group, fourth_group];

    var top10Actress = getTop10Actress(orderedActresses);

    var name = 0;
    for (var i = 0; i < 10; i++) {
        var my_div_group = (i % 2 === 0) ? groups[0] : groups[1];

        var actress = top10Actress[i][name];
        plotLeadActress(actress, my_div_group, i);
    }
}

function getTop10Actress(orderedActresses) {

    var top10LeadActress = [];
    for (var i = 0; i < 10; i++) {
        top10LeadActress.push(orderedActresses[i]);
    }

    return top10LeadActress;
}

function plotLeadActress(actress, div, i) {

    var src = getImageSrc(actress);
    var id = myId(actress);

    var size = 110;
    var padding_circle = 2;

    var svg_width = size;
    var svg_height = size;

    var img_section = div
        .append("div")
        .attr("class", "img_section")
        .append("svg")
        .attr("width", svg_width)
        .attr("height", svg_height);

    var defs =  img_section
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

    var circle = img_section
        .append("svg:circle")
        .attr("cx", size / 2)
        .attr("cy", size / 2)
        .attr("r", size/2 - padding_circle)
        .style("fill", "url(#"+ id +")")
        .attr("stroke", "#E0E3DC")
        .attr("stroke-width", 3);
}