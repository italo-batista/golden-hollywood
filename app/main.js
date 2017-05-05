
function selectMenu(menu) {

    var menus = ["menu-film", "menu-actress", "menu-actor"];
    var categories = {"menu-film":"best-films", "menu-actress":"lead-actress", "menu-actor":"lead-actor"};

    var selectedChart;
    var hiddenChart;
    for (var i = 0; i < menus.length; i++) {

        var m = menus[i];
        if (m === menu) {
            document.getElementById(m).className += "btn-selected";
            selectedChart = document.getElementById(categories[m]);
            selectedChart.style.display = "block";
        } else {
            document.getElementById(m).className = document.getElementById(m).className.split("btn-selected").join("");
            hiddenChart = document.getElementById(categories[m]);
            hiddenChart.style.display = "none";
        }
    }

    plotTops(categories[menu], "all");
}

function selectFilter(id) {

    var ids = ["20s", "30s", "40s", "50s", "60s", "all"];

    for (var i = 0; i < ids.length; i++) {

        if (id === ids[i]) {
            console.log( document.getElementById(id).className)
            document.getElementById(ids[i]).className += "btn-selected";
        } else {
            document.getElementById(ids[i]).className = document.getElementById(ids[i]).className.split("btn-selected").join("");
        }
    }
}

function getCategorySelected() {

    var buttons = ["menu-film", "menu-actress", "menu-actor"];
    var categories = {"menu-film":"best-films", "menu-actress":"lead-actress", "menu-actor":"lead-actor"};

    for (var i = 0; i < buttons.length; i++) {

        var className = document.getElementById( buttons[i] ).className;
        if (className === "btn-selected") {
            return categories[buttons[i]];
        }
    }
}

function clear(id) {

    var ids = [ "best-films", "lead-actress", "lead-actor"];

    var content = d3.select(".content");
    for (var i = 0; i < ids.length; i++) {
        document.getElementById(ids[i]).remove();
    }

    content.append("div").attr("id", id);

    var indexToRemove = ids.indexOf(id);
    ids.splice(indexToRemove, 1);

    for (var i = 0; i < ids.length; i++) {
        content.append("div").attr("id", ids[i]);
    }
}

function getImageSrc(name, category) {

    var folders = {"lead-actress":"actress", "lead-actor":"actor"};
    var folder = folders[category];

    var src = "../img/" + folder + "/";

    for (var i = 0; i < name.length; i++) {
        if (name[i] === " ") {
            src = src + "_";
        } else if (name[i] === "'") {
            // do nothing
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

function getYear(s) {
    var ano = parseInt( s.substring(0, 4) );
    return ano;
}


function filterAndPlot(filterId) {

    selectFilter(filterId);

    var category = getCategorySelected();
    plotTops(category, filterId);
}

function plotTops(mCategory, filter) {

    clear(mCategory);

    var winners = {};
    var nominations = {};

    var categories = {"lead-actor":"Actor -- Leading Role", "lead-actress":"Actress -- Leading Role"};

    d3.csv("data/oscar_data.csv", function (error, data) {

        if (error) throw error;

        data.forEach(function (d) {

            function isLead(d) {
                return d.categoria === categories[mCategory];
            }
            function won(d) {
                return d.venceu === "YES"
            }
            function mustFilter(d) {

                var year = getYear(d);

                if (filter == "all")
                    return true;

                else if (filter == "20s")
                    return year >= 1920 & year < 1930;

                else if (filter == "30s")
                    return year >= 1930 & year < 1940;

                else if (filter == "40s")
                    return year >= 1940 & year < 1950;

                else if (filter == "50s")
                    return year >= 1950 & year < 1960;

                else if (filter == "60s")
                    return year >= 1960 & year < 1970;
            }

            if (mustFilter(d.ano)) {

                if (isLead(d) && won(d)) {
                    var name = d.atribuicao;
                    if (!winners[name]) winners[name] = 1;
                    else ++winners[name];

                } else if (isLead(d) && !won(d)) {
                    var name = d.atribuicao;
                    if (!nominations[name]) nominations[name] = 1;
                    else ++nominations[name];
                }
            }
        }); // end for

        var topWinners = [];
        for (var winner in winners) {
            topWinners.push([winner, winners[winner]]);
        }
        topWinners.sort(function(a, b) {
            return -a[1] + b[1];
        });
        
        var topNominations = [];
        for (var nominee in nominations) {
            topNominations.push([nominee, nominations[nominee]]);
        }
        topNominations.sort(function(a, b) {
            return -a[1] + b[1];
        });

        plotTop10Winners(topWinners, mCategory);
        plotTop10Nominations(topNominations, mCategory);

    });
}

function plotTop10Winners(orderedWinners, mCategory) {

    var div_my_category = d3.select("#" + mCategory)
        .attr("class", "col-lg-1");

    var won = div_my_category
        .append("div")
        .attr("class", "won");

    won.append("div").
    attr("class", "won-title");

    won = won
        .append("div")
        .attr("class", "center");

    plotTitle(true);

    var first_group = won
        .append("div")
        .attr("class", "first_group");

    var second_group = won
        .append("div")
        .attr("class", "second_group");

    var groups = [first_group, second_group];

    var top10 = getTop10(orderedWinners);

    var name = 0;
    for (var i = 0; i < 10; i++) {

        if (top10[i] != null) {
            var my_div_group = (i % 2 === 0) ? groups[0] : groups[1];

            var winner = top10[i][name];
            plot(winner, mCategory, my_div_group, "won", i);
        }
    }
}

function plotTop10Nominations(orderedNominations, mCategory) {

    var div_my_category = d3.select("#" + mCategory)
        .attr("class", "col-lg-1");

    var nominees = div_my_category
        .append("div")
        .attr("class", "nominees");

    nominees.append("div").
        attr("class", "nominees-title");

    nominees = nominees
        .append("div")
        .attr("class", "center");

    plotTitle(false);

    var first_group = nominees
        .append("div")
        .attr("class", "first_group");

    var second_group = nominees
        .append("div")
        .attr("class", "second_group");

    var groups = [first_group, second_group];

    var top10 = getTop10(orderedNominations);

    var name = 0;
    for (var i = 0; i < 10; i++) {

        if (top10[i] != null) {
            var my_div_group = (i % 2 === 0) ? groups[0] : groups[1];

            var nominee = top10[i][name];
            plot(nominee, mCategory, my_div_group, "nominee", i);
        }
    }
}

function plot(name, category, div, type, i) {

    var src = getImageSrc(name, category);
    var id = myId(name);

    var circle_stroke_color = {"won":"#DAA520", "nominee":"#C0C0C0"}; //"#a67c00 #bf9b30

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
        .attr("stroke", circle_stroke_color[type])
        .attr("stroke-width", 5);

    circle
        .append("svg:title")
        .text(name);
}

function plotTitle(hasWon) {

    var width = 400;
    var N = 40;      // tamanho máximo de palavra que cabe numa box de uma disciplina
    var xTitleScale = d3.scaleLinear()
        .domain([0, N])
        .range([0, width]);

    var title = "Top "+ (hasWon ? "Winners" : "Nominees");

    var centralizar = width/2 - xTitleScale(title.length)/2;

    var c = hasWon ? "won" : "nominees";

    var div = d3.select("." + c + "-title");

    var svg = div.append("svg")
        .attr("width", width)
        .attr("height", 35);

    var rect_width = 68;
    var rect_x = (100 - rect_width)/2;

    svg.append("rect")
        .attr("x", rect_x+"%")
        .attr("y", "0%")
        .attr("width",rect_width+"%")
        .attr("height","30px")
        .style("fill", "#f5c959");

    svg.append("text")
        .attr("x", centralizar)
        .attr("y", "15px")
        .attr("dy", ".35em")
        .attr("font-weight", "700")
        .attr("font-size", "18px")
        .style("fill", "#000")
        .text(title);
}

function getTop10(ordered) {

    var top10 = [];
    for (var i = 0; i < 10; i++) {
        top10.push(ordered[i]);
    }

    return top10;
}

plotTops("lead-actress", "all");

