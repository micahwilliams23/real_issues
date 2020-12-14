const trump_weeks = d3.csv('data/trump_averages.csv', function(x){
    return {
        network: x.network,
        week: +x.week,
        pct: +x.pct,
        rm: +x.rm,
        n: +x.n,
        date: Date(x.date)
    };
})

const trump_months = d3.csv('data/trump_months.csv', function(x){
    return {
        network: x.network,
        month: +x.month,
        n: +x.n,
        date: Date(x.date)
    };
})


// set the dimensions and margins of the graph
var margin = {top: 50, right: 45, bottom: 30, left: 45},
width = window.innerWidth * 0.65 - margin.left - margin.right,
height = window.innerHeight - margin.top - margin.bottom;
    
function hidePoints(){

    // transition points
    container.selectAll('.point')
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

function showContainer(){

    hidePoints()
    container.selectAll('.yaxis1')
        .transition()
        .duration(0)
        .attr('opacity', 1);

        container.selectAll('.yaxis2')
        .transition()
        .duration(0)
        .attr('opacity', 0);

    container
        .transition()
        .duration(500)
        .attr('opacity', 1)
};

function showPoints(){

    showContainer()

    // transition points
    container.selectAll('.point')
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
        .text('Percent of CNN and Fox News Titles Containing \'trump\' by week')
};

function toMean(){

    // shift to mean
    container.selectAll('.point')
        .transition()
        .ease(d3.easeBounce)
        .duration(600)
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

        setTimeout(
            function(){
                container.selectAll('.line1')
                    .transition()
                    .duration(1000)
                    .attr('stroke-opacity', 0)
                },
            1000
        );
};

function showLines1(){

    container.selectAll('.line1')
        .transition()
        .duration(500)
        .attr('stroke-opacity', 1);

    setTimeout(
        function(){
            container.selectAll('.point')
                .transition()
                .duration(500)
                .attr('opacity', 0)
                .delay(data => delayScale(data.week));
            },
            500
    );
};

function showLines2(){

    container.selectAll('.line1')
        .transition()
        .duration(500)
        .attr('stroke-opacity', 0);

    container.selectAll('.yaxis1')
        .transition()
        .duration(500)
        .attr('opacity', 0);

    container.select('#plot-title')
        .transition()
        .duration(500)
        .attr('fill-opacity', '0')
        .transition()
        .attr('fill-opacity', '1')
        .text('Number CNN and Fox News Titles Containing \'Trump\' by month')

    setTimeout(
        function(){
            container.selectAll('.line2')
                .transition()
                .duration(500)
                .attr('stroke-opacity', 1);

            container.selectAll('.yaxis2')
                .transition()
                .duration(500)
                .attr('opacity', 1);
            },
            500
    );
}

function hideContainer(){
    container
        .transition()
        .duration(500)
        .attr('opacity', 0)

    hidePoints()
};

function noTransition(){};

// set up scroller... many thanks to https://vallandingham.me/scroller.html
// find position of top of sections
const sections = d3.selectAll('.section-contents')
sectionPositions = [];
var startPos;
var currentIndex;

sections.each(function(d, i){
    var top = this.getBoundingClientRect().top;
    
    // set top of first section element as top
    if(i == 0){
        startPos = top;
    }

    // append positions to array
    sectionPositions.push(top - startPos);
});

// new dispatcher with 'active' and 'progress' methods
var dispatch = d3.dispatch('active', 'progress')

// set function to execute when active element updates
dispatch.on('active', function(index){

    transitions = [
        noTransition,
        hideContainer,
        showContainer,
        showPoints,
        toMean,
        showLines1,
        showLines2
    ]

    transitions[index]();
})

// find position of window
function position(){

    // slightly offset position
    // var pos = window.pageYOffset - 10;
    var pos = this.scrollTop + window.innerHeight * 0.5;

    // find index of current section box
    var sectionIndex = d3.bisect(sectionPositions, pos);

    // keep index without bounds of array (d3.bisect can return value larger than array)
    sectionIndex = Math.min(sections.size() - 1, sectionIndex);

    // if current section has changed,
    if(currentIndex !== sectionIndex){

        // send new index to 'active' method using event dispatching
        dispatch.call('active', this, sectionIndex);
        currentIndex = sectionIndex;
    };
};

// execute function when window scrolls
d3.select('#sections')
    .on('scroll.scroller', position);

const xTicks = [2016, 2017, 2018, 2019, 2020, 2021];
const xScale = d3.scaleLinear()
    .domain([2015.7, 2021])
    .range([0, width]);

const yTicks = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6];
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
    .attr('opacity', 0)
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

// add y axis
container.append('g')
    .classed('yaxis1', true)
    .call(d3.axisLeft(yScale).ticks(5).tickFormat(d => d * 100 + '%'))
    .attr('transform', 'translate('+ margin.left +',0)');

// add y grid
container.selectAll('.grid')
    .data(yTicks)
    .enter()
    .append('line')
    .classed('.grid', true)
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
container.selectAll('.grid')
    .data(xTicks)
    .enter()
    .append('line')
    .classed('.grid', true)
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
    .attr('x', 0)
    .attr('y', margin.top / 2);

trump_weeks.then(function(d){

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
    
    // add lines
    container.selectAll('.line1')
        .data(nested_d)
        .enter()
        .append('path')
        .classed('line1', true)
        .attr('fill', 'none')
        .attr('stroke-opacity', 0)
        .attr('stroke', data => colorScale(data.key))
        .attr('stroke-width', 3)
        .attr('d', function(d){
            return d3.line()
            .x(d => margin.left + xScale(d.week))
            .y(d => yScale(d.rm))
            (d.values)
        });
})

// add second y scale
const yScale2 = d3.scaleLinear()
        .domain([0, 1420])
        .range([height, margin.top])

trump_months.then(function(d){

    // nest data
    var nested_d = d3.nest()
        .key(d => d.network)
        .entries(d);

    // add second set of lines
    container.selectAll('.line2')
        .data(nested_d)
        .enter()
        .append('path')
        .classed('line2', true)
        .attr('fill', 'none')
        .attr('stroke-opacity', 0)
        .attr('stroke', data => colorScale(data.key))
        .attr('stroke-width', 3)
        .attr('d', function(d){
            return d3.line()
            .x(d => margin.left + xScale(d.month))
            .y(d => yScale2(d.n))
            (d.values)
        });

    // add second y axis
    container.append('g')
        .classed('yaxis2', true)
        .call(d3.axisLeft(yScale2).ticks(5))
        .attr('transform', 'translate('+ margin.left +',0)')
        .attr('opacity', '1');
});