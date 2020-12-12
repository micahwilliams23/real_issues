const trump = d3.csv('trump_averages.csv', function(x){
    return {
        network: x.network,
        week: +x.week,
        pct: +x.pct,
        rm: +x.rm
    };
})

window.scroll({behavior: 'smooth'});

// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 40, left: 60},
width = window.innerWidth * 0.65 - margin.left - margin.right,
height = window.innerHeight - margin.top - margin.bottom;

const xTicks = [2016, 2017, 2018, 2019, 2020, 2021];
const xScale = d3.scaleLinear()
    .domain([2015.7, 2021])
    .range([0, width]);

const yTicks = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6];
const yScale = d3.scaleLinear()
    .domain([0, 0.6])
    .range([height, margin.top]);

const colorScale = d3.scaleOrdinal()
    .domain(['CNN','Fox News'])
    .range(['#377eb8','#e41a1c']);

// create scale to calculate delay time
const delayScale = d3.scaleLinear()
    .domain([2015.692, 2020.942])
    .range([0, 1000]);

const container = d3.select('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

// add y axis
container.append('g')
    .call(d3.axisLeft(yScale).ticks(5).tickFormat(d => d * 100 + '%'))
    .attr('transform', 'translate('+ margin.left +',0)');

// add y grid
container.selectAll('.vline')
    .data(yTicks)
    .enter()
    .append('line')
    .classed('.vline', true)
    .attr('x1', margin.left)
    .attr('x2', window.innerWidth * 0.65)
    .attr('y1', d => yScale(d))
    .attr('y2', d => yScale(d))
    .attr('stroke-width', '1')
    .attr('stroke', '#444')
        
// add x axis
container.append('g')
    .call(d3.axisBottom(xScale).ticks(5).tickValues(xTicks).tickFormat(d => d))
    .attr('transform', 'translate(' + margin.left + ',' + height +')');

// add x grid
container.selectAll('.vline')
    .data(xTicks)
    .enter()
    .append('line')
    .classed('.vline', true)
    .attr('y1', height)
    .attr('y2', 0)
    .attr('x1', d => xScale(d) + margin.left)
    .attr('x2', d => xScale(d) + margin.left)
    .attr('stroke-width', '1')
    .attr('stroke', '#444')
    
// add plot title
container.append('text')
    .attr('id', 'plot-title')
    .attr('fill', 'white')
    .attr('x', margin.left + 10)
    .attr('y', 18);

trump.then(function(d){

    // add points
    container.selectAll('.point')
        .data(d)
        .enter()
        .append('circle')
        .classed('point', true)
        .attr('r', 3)
        .attr('cy', data => yScale(data.pct) + 500)
        .attr('cx', data => margin.left + xScale(data.week))
        .attr('opacity', 0)
        .attr('fill', data => colorScale(data.network)); 
    
    // nest data
    var nested_d = d3.nest()
        .key(d => d.network)
        .entries(d);
    
    // define line generator
    function makeLine(data){
        d3.line()
            .x(data => margin.left + xScale(data.week))
            .y(data => yScale(data.rm))
    };

    // create lines
    container.selectAll('.line')
        .data(nested_d)
        .enter()
        .append('path')
        .classed('line', true)
        .attr('stroke-opacity', 0)
        .attr('fill', 'none')
        .attr('stroke', data => colorScale(data.key))
        .attr('stroke-width', 3)
        .attr('d', function(d){
            return d3.line()
            .x(d => margin.left + xScale(d.week))
            .y(d => yScale(d.rm))
            (d.values)
        });
})

function showPoints(){

    // transition points
    container.selectAll('circle')
        .transition()
        .duration(500)
        .attr('opacity', 1)
        .attr('cy', data => yScale(data.pct))
        .delay(data => 0.5 * delayScale(data.week));

    container.select('#plot-title')
        .transition()
        .duration(500)
        .attr('fill-opacity', '0')
        .transition()
        .attr('fill-opacity', '1')
        .text('Percent of CNN and Fox News Titles Containing \'Trump\' by week')
};

function hidePoints(){

    // transition points
    container.selectAll('circle')
        .transition()
        .duration(500)
        .attr('cy', data => yScale(data.pct) + 500)
        .attr('opacity', 0)
        .delay(data => delayScale(data.week));

    container.select('#plot-title')
        .transition()
        .duration(500)
        .attr('fill-opacity', '0')

    container.selectAll('.line')
            .transition()
            .duration(500)
            .attr('stroke-opacity', 0)

};

function toMean(){

    // shift to mean
    container.selectAll('circle')
        .transition()
        .duration(500)
        .attr('opacity', 1)
        .attr('cy', data => yScale(data.rm))
        .delay(data => delayScale(data.week));

    container.select('#plot-title')
        .transition()
        .duration(500)
        .attr('fill-opacity', '0')
        .transition()
        .attr('fill-opacity', '1')
        .text('Percent of CNN and Fox News Titles Containing \'Trump\' by week, 4-Week Rolling Average')

    
    container.selectAll('.line')
        .transition()
        .duration(500)
        .attr('stroke-opacity', 0)
}

function showLines(){

    container.selectAll('.line')
                .transition()
                .duration(2000)
                .attr('stroke-opacity', 1)

    setTimeout(
        function(){
            container.selectAll('circle')
                .transition()
                .duration(1000)
                .attr('opacity', 0)},
            1000
    );
}