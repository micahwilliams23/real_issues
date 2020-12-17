// load in data
const trump_weeks = d3.csv('data/trump_averages.csv', function(x){
    return {
        network: x.network,
        week: +x.week,
        pct: +x.pct,
        rm: +x.rm,
        n: +x.n,
        t: +x.t,
        date: Date(x.date)
    };
});

const cnn_words = d3.csv('data/cnn_words.csv', function(x){
    return {
        id: x.id,
        show: x.show,
        date: Date(x.date),
        word: x.word
    };
});

const headlines = d3.csv('data/headlines.csv', function(x){
    return {
        title: x.title,
        date: Date(x.date),
        network: x.network
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

function deleteSplash(){

    // find splash page texts and split by character into arrays
    var d = d3.select('.maintext').text().split('')
    var e = d3.selectAll('.subtext').text().split('')

    // for each character in array:
    for (i in d3.range(0, d.length)){

        // set delay between function calls
        setTimeout(function(){

            // replace text with text minus last character
            d3.selectAll('.maintext')
            .text(function(){
                var p = d.pop()
                var remain = d.join('')
                return remain;
            })

        // make entire function call last half a second 
        }, 500 / d.length * i);
    }

    // repeat for subtext
    for (i in d3.range(0, e.length)){
        setTimeout(function(){
            d3.selectAll('.subtext')
            .text(function(){
                var p = e.pop()
                var remain = e.join('')
                return remain;
            })
        }, 500 / e.length * i);
    }

    // remove splash element
    setTimeout(function(){
            d3.select('#splash-page')
            .remove()
    }, 500);
}

var splash = true;
function showContainer(){

    if (splash == true) {
        deleteSplash();
    }

    hidePoints()
    container.selectAll('.yaxis1')
        .transition()
        .duration(0)
        .attr('opacity', 1)
        .delay(500);

    container.selectAll('.yaxis2')
        .transition()
        .duration(0)
        .attr('opacity', 0)
        .delay(500);
    
    container.selectAll('.yaxis3')
        .transition()
        .duration(0)
        .attr('opacity', 0)
        .delay(500);

    container
        .transition()
        .duration(500)
        .attr('opacity', 1)
        .delay(500)

    splash = false;
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
        .text('Percent of CNN and Fox News Headlines Containing \'Trump\' by week')
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
        .text('CNN and Fox News Headlines Containing \'Trump\' by week, 4-Week Rolling Average')
    
    container.selectAll('.line1')
        .transition()
        .duration(500)
        .attr('stroke-opacity', 0)
        .delay(500);
};

function showLines1(){

    container.selectAll('.line1')
        .transition()
        .duration(500)
        .attr('stroke-opacity', 1);

    container.selectAll('.line2')
        .transition()
        .duration(500)
        .attr('opacity', 0);

    container.selectAll('.yaxis2')
        .transition()
        .duration(500)
        .attr('opacity', 0);

    container.select('#plot-title')
        .transition()
        .duration(500)
        .attr('fill-opacity', '0')
        .transition()
        .attr('fill-opacity', '1')
        .text('CNN and Fox News Headlines Containing \'Trump\' by week, 4-Week Rolling Average')

    // change y grid
    container.selectAll('.ygrid')
        .transition()
        .duration(500)
        .attr('y1', d => yScale(d))
        .attr('y2', d => yScale(d))
    container.selectAll('.point')
        .transition()
        .duration(500)
        .attr('opacity', 0)
        .delay(data => 500 + delayScale(data.week));

    container.selectAll('.yaxis1')
        .transition()
        .duration(500)
        .attr('opacity', 1)
        .delay(500);
};

function showLines2(){

    container.selectAll('.line1')
        .transition()
        .duration(500)
        .attr('stroke-opacity', 0);
        
    container.selectAll('.yaxis3')
        .transition()
        .duration(500)
        .attr('opacity', 0);

    svgbase
        .transition()
        .duration(500)
        .attr('opacity', 1);

    container.selectAll('.yaxis1')
        .transition()
        .duration(500)
        .attr('opacity', 0);

    container.selectAll('.yaxis2')
        .transition()
        .duration(500)
        .attr('opacity', 1)
        .delay(500);

    // change y grid
    container.selectAll('.ygrid')
        .transition()
        .duration(500)
        .attr('y1', d => yScale2(d * 1000))
        .attr('y2', d => yScale2(d * 1000))

    svgdata.selectAll('.line2')
        .transition()
        .duration(500)
        .attr('d', function(d){
            return d3.area()
            .x(d => margin.left + xScale(d.week))
            .y1(d => yScale2(d.n))
            .y0(yScale2(0))
            (d.values)
        });
    
    container.select('#plot-title')
        .transition()
        .duration(500)
        .attr('fill-opacity', '0')
        .transition()
        .attr('fill-opacity', '1')
        .text('Number of CNN and Fox News Titles Containing \'Trump\' by week')
    
    container.selectAll('.line2')
        .transition()
        .duration(500)
        .attr('opacity', 1)
        .attr('fill-opacity', 0.5)
        .delay(500);
        
    container.selectAll('.totalCircles')
        .transition()
        .duration(500)
        .attr('r', 1)

    container.selectAll('.totals')
        .transition()
        .duration(500)
        .attr('opacity', 0)

};

function showLines3(){

    svgbase
        .transition()
        .duration(500)
        .attr('opacity', 1);

    container.selectAll('.yaxis2')
        .transition()
        .duration(500)
        .attr('opacity', 0);

    container.selectAll('.yaxis3')
        .transition()
        .duration(500)
        .attr('opacity', 1)
        .delay(500);

    // change y grid
    container.selectAll('.ygrid')
        .transition()
        .duration(500)
        .attr('y1', d => yScale3(d * 50))
        .attr('y2', d => yScale3(d * 50))
 
    // rescale y values
    svgdata.selectAll('.line2')
        .transition()
        .duration(500)
        .attr('opacity', 1)
        .attr('d', function(d){
            return d3.area()
            .x(d => margin.left + xScale(d.week))
            .y1(d => yScale3(d.n))
            .y0(yScale3(0))
            (d.values)
        });
        
    container.selectAll('.totalCircles')
        .transition()
        .duration(500)
        .attr('r', 1)

    container.selectAll('.totals')
        .transition()
        .duration(500)
        .attr('opacity', 0)

};

function hideContainer(){

    if (splash == true) {
        deleteSplash();
    } splash = false;

    container
        .transition()
        .duration(500)
        .attr('opacity', 0)

    hidePoints()
};

function showCircles(){
    
    container.select('.totals')
        .transition()
        .duration(500)
        .attr('opacity', 1);

    container.selectAll('.totalCircles')
        .transition()
        .duration(500)
        .attr('r', data => radiusScale(data.value));

    //  hide everything else
    container.selectAll('.line2')
        .transition()
        .duration(500)
        .attr('opacity', 0);
    svgbase
        .transition()
        .duration(500)
        .attr('opacity', 0);
}

function hideCircles(){

    container.select('.totals')
        .transition()
        .duration(500)
        .attr('opacity', 0)
        .delay(250);

    container.selectAll('.totalCircles')
        .transition()
        .duration(500)
        .attr('r', data => 1);
};

function showCnnBars(){

    d3.select('svg')
        .transition()
        .duration(500)
        .attr('opacity', 1)

    d3.select('.svgbase')
        .transition()
        .duration(0)
        .attr('opacity', 0)

    svgdata.selectAll('.cnnBar')
        .transition()
        .ease(d3.easeCircle)
        .duration(1000)
        .attr('opacity', 1)
        .attr('width', d => xScale2(d.n))
        .delay(500)

    svgdata.selectAll('.cnnBarLabel')
        .transition()
        .duration(500)
        .attr('opacity', 1)
        .delay(500)
    svgdata.selectAll('.cnnBarN')
        .transition()
        .duration(500)
        .attr('opacity', 1)
        .delay(500)

};

function mouseover(d){

    tooltip.select('rect')
        .transition()
        .duration(500)
        .attr('opacity', 1);
    tooltip.select('text')
        .transition()
        .duration(500)
        .attr('opacity', 1);
    tooltip
        .transition()
        .duration(500)
        .attr('opacity', 1);

    d3.select(this)
        .transition()
        .duration(50)
        .attr('r', 10);

};

function mousemove(d){

    var pos = this.getBoundingClientRect();
    const getX = function(pos){
        var xShift = pos.x - window.innerWidth * 0.35;
        return (xShift + 500 + margin.right) > width ? width - 500 + margin.left + margin.right : xShift;
    };
    const getY = function(pos){
        return (pos.y + 150) > height ? 0 : pos.y;
    };

    var x = getX(pos);
    var y = getY(pos);
    const ptData = d3.select(this).data()[0]

    const getText = function(d){
        return d.network;
    };

    var newText = getText(ptData);

    tooltip
        .select('rect')
        .attr('x', x + 'px')
        .attr('y', y + 'px');
    tooltip
        .select('text')
        .attr('x', x + 5 + 'px')
        .attr('y', y + 15 + 'px')
        .text(newText);

};

function mouseleave(d){

    tooltip
        .transition()
        .duration(500)
        .attr('opacity', 0);

    d3.select(this)
        .transition()
        .duration(50)
        .attr('r', 3);
};

function mouseover2(d){

    svgdata.selectAll('.cnnBar')
        .transition()
        .duration(100)
        .attr('stroke', '#444')

    d3.select(this)
        .transition()
        .duration(0)
        .attr('stroke', colorScale('CNN'))

    headlineQuery = d3.select(this).data()[0].word
};

function mousemove2(d){
    svgdata.selectAll('.cnnBar')
        .transition()
        .duration(100)
        .attr('stroke', '#444')

    d3.select(this)
        .transition()
        .duration(0)
        .attr('stroke', colorScale('CNN'))
};

function mouseleave2(d){
    svgdata.selectAll('.cnnBar')
        .transition()
        .duration(100)
        .attr('stroke', colorScale('CNN'))
};

function emptyFunction(){};

// set up scroller... many thanks to https://vallandingham.me/scroller.html
// find position of top of sections
const sections = d3.selectAll('.section-contents')
sectionPositions = [];
var startPos, lastIndex, headlineQuery;

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
        emptyFunction,
        showContainer,
        showPoints,
        emptyFunction,
        toMean,
        showLines1,
        showLines2,
        showLines3,
        showCircles,
        hideCircles,
        emptyFunction,
        showCnnBars,
    ]

    transitions[index]();
})

// find position of window
function position(){

    // slightly offset position
    var pos = this.scrollTop + window.innerHeight * - 0.5;

    // find index of current section box
    var currentIndex = d3.bisect(sectionPositions, pos);

    // keep index without bounds of array (d3.bisect can return value larger than array)
    currentIndex = Math.min(sections.size() - 1, currentIndex);

    // if current section has changed,
    if(currentIndex !== lastIndex){

        // find which sections have been scrolled past
        var sign = (currentIndex - lastIndex) < 0 ? -1 : 1;
        var scrolledSections = d3.range(lastIndex + sign, currentIndex + sign, sign);
        
        // call transition function for each section
        scrolledSections.forEach(function(section){
            dispatch.call('active', container, section);
        });
        lastIndex = currentIndex;
    };
};

// execute function when window scrolls
d3.select('#sections')
    .on('scroll.scroller', position);

//  add scales
const xTicks = [2016, 2017, 2018, 2019, 2020, 2021];
const xScale = d3.scaleLinear()
    .domain([2015.7, 2021])
    .range([0, width]);
const xScale2 = d3.scaleLinear()
    .range([0, width]);

const yTicks = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6];
const yScale = d3.scaleLinear()
    .domain([0, 0.6])
    .range([height, margin.top]);
const yScale2 = d3.scaleLinear()
    .domain([0, 450])
    .range([height, margin.top]);
const yScale3 = d3.scaleLinear()
    .domain([0, 25])
    .range([height, margin.top]);

const yBands = d3.scaleBand()
    .range([margin.top, height]);

const colorScale = d3.scaleOrdinal()
    .domain(['CNN','Fox News'])
    .range(['#75c0fd','#e41a1c']);

const delayScale = d3.scaleLinear()
    .domain([2015.692, 2020.942])
    .range([0, 1000]);

const radiusScale = d3.scaleSqrt()
    .domain([0, 186966])
    .range([0, 200])

const radiusScale2 = d3.scaleSqrt()
    .domain([0, 28639])
    .range([0, width / 7])

const textScale = d3.scaleLinear()
    .domain([1290, 28639])
    .range([20,50])

const container = d3.select('svg')
    .attr('opacity', 0)
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

const svgbase = container.append('g')
    .classed('svgbase', true);

const svgdata = container.append('g')
    .classed('svgdata', true);

const tooltip = container.append('g')
    .classed('tooltip', true)

tooltip
    .append('rect')
    .attr('opacity', 0)
    .attr('height', '100px')
    .attr('width', '500px')
    .attr('fill', 'white')
    .attr('z-index', 200)
    .attr('rx', '5px')

tooltip
    .append('text')
    .attr('opacity', 0)
    .attr('fill', 'black')
    .attr('size', 15)

// add y axis
svgbase.append('g')
    .classed('yaxis1', true)
    .call(d3.axisLeft(yScale).ticks(5).tickFormat(d => d * 100 + '%'))
    .attr('transform', 'translate('+ margin.left +',0)');
svgbase.append('g')
    .classed('yaxis2', true)
    .call(d3.axisLeft(yScale2).ticks(5))
    .attr('transform', 'translate('+ margin.left +',0)');
svgbase.append('g')
    .classed('yaxis3', true)
    .call(d3.axisLeft(yScale3).ticks(5))
    .attr('transform', 'translate('+ margin.left +',0)');

// add y grid
svgbase.selectAll('.ygrid')
    .data(yTicks)
    .enter()
    .append('line')
    .classed('ygrid', true)
    .attr('x1', margin.left)
    .attr('x2', window.innerWidth * 0.65)
    .attr('y1', d => yScale(d))
    .attr('y2', d => yScale(d))
    .attr('stroke-width', '1')
    .attr('stroke', '#444')
        
// add x axis
svgbase.append('g')
    .call(d3.axisBottom(xScale).ticks(5).tickValues(xTicks).tickFormat(d => d))
    .attr('transform', 'translate(' + margin.left + ',' + height +')');

// add x grid
svgbase.selectAll('.xgrid')
    .data(xTicks)
    .enter()
    .append('line')
    .classed('.xgrid', true)
    .attr('y1', height)
    .attr('y2', 0)
    .attr('x1', d => xScale(d) + margin.left)
    .attr('x2', d => xScale(d) + margin.left)
    .attr('stroke-width', '1')
    .attr('stroke', '#444')
    
// add plot title
svgbase.append('text')
    .attr('id', 'plot-title')
    .attr('fill', 'white')
    .attr('x', 0)
    .attr('y', margin.top / 2);

const legend = [
    {network: 'CNN', x: 2016.05, y: 0.58},
    {network: 'Fox News', x: 2016.05, y: 0.56}
]

// add legend
svgbase.selectAll('.legendRect')
    .data(legend)
    .enter()
    .append('rect')
    .classed('legendRect', true)
    .attr('x', data => xScale(data.x) + margin.left)
    .attr('y', data => yScale(data.y) - 10)
    .attr('width', 10)
    .attr('height', 10)
    .attr('fill', data => colorScale(data.network))

// add legend
svgbase.selectAll('.legendText')
    .data(legend)
    .enter()
    .append('text')
    .classed('legendText', true)
    .attr('x', data => xScale(data.x) + margin.left + 12)
    .attr('y', data => yScale(data.y))
    .attr('width', 15)
    .attr('height', 15)
    .attr('fill', 'white')
    .text(data => data.network)

trump_weeks.then(function(d){

    var trumpPlots = svgdata.append('g')
        .classed('trump-plots', true);

    // add points
    trumpPlots.selectAll('.point')
        .data(d)
        .enter()
        .append('circle')
        .classed('point', true)
        .attr('r', 3)
        .attr('cy', data => yScale(data.pct) + 500)
        .attr('cx', data => margin.left + xScale(data.week))
        .attr('opacity', 0)
        .attr('fill', data => colorScale(data.network))
        .on('mouseover',mouseover) 
        .on('mousemove',mousemove) 
        .on('mouseleave',mouseleave); 
    
    // nest data
    var nested_d = d3.nest()
        .key(d => d.network)
        .entries(d);
    
    // add first set of lines
    trumpPlots.selectAll('.line1')
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

    // add second set of lines
    trumpPlots.selectAll('.line2')
        .data(nested_d)
        .enter()
        .append('path')
        .classed('line2', true)
        .attr('fill', data => colorScale(data.key))
        .attr('opacity', 0)
        .attr('stroke', data => colorScale(data.key))
        .attr('stroke-width', 3)
        .attr('d', function(d){
            return d3.area()
            .x(d => margin.left + xScale(d.week))
            .y1(d => yScale2(d.n))
            .y0(yScale2(0))
            (d.values)
        });
    
    const xBands = d3.scaleBand()
        .domain(['CNN', 'Fox News'])
        .range([margin.left + 100, width - 100])

    // add network totals data
    var networkTotals = [
        {network: 'CNN', value: 186966, f0: 0.5},
        {network: 'CNN', value: 38702, f0: 1},
        {network: 'Fox News', value: 5957, f0: 0.5},
        {network: 'Fox News', value: 1692, f0: 1},
    ]

    var networkLabels = [
        {network: 'CNN', value: 186966},
        {network: 'Fox News', value: 5957}
    ]

    // add network totals circles
    trumpPlots.append('g')
        .classed('totals', true)
        .selectAll('.totalCircles')
        .data(networkTotals)
        .enter()
        .append('circle')
        .classed('totalCircles', true)
        .attr('r', 1)
        .attr('cy', function(data){
            if (data.value == 1692) {
                return height / 2 + radiusScale(5957) - radiusScale(1592);
            } else if (data.value == 38702) {
                return height / 2 + radiusScale(186966) - radiusScale(38702);
            } else return height / 2;
        })
        .attr('cx', data => width / 4 + xBands(data.network))
        .attr('stroke-width', 3)
        .attr('stroke', data => colorScale(data.network))
        .attr('fill-opacity', data => data.f0)
        .attr('fill', data => colorScale(data.network)); 

    trumpPlots.select('.totals')
        .selectAll('.totalText')
        .data(networkTotals)
        .enter()
        .append('text')
        .classed('totalText', true)
        .attr('x', data => width / 4 + xBands(data.network))
        .attr('fill', 'white')
        .attr('text-anchor', 'middle')
        .attr('font-weight', 'bolder')
        .attr('font-family', 'Helvetica')
        .attr('y', function(data){
            if (data.value == 1692) {
                return height / 2 + radiusScale(1692);
            } else if (data.value == 38702) {
                return height / 2 + radiusScale(38702) + margin.bottom;
            } else {return height / 2};
        })
        .text(data => data.value.toString().replace(/(\d{3})$/, ',$1'));
    
    trumpPlots.select('.totals')
        .selectAll('.totalLabels')
        .data(networkLabels)
        .enter()
        .append('text')
        .classed('totalLabels', true)
        .attr('x', data => width / 4 + xBands(data.network))
        .attr('fill', 'white')
        .attr('text-anchor', 'middle')
        .attr('font-weight', 'bolder')
        .attr('font-family', 'Helvetica')
        .attr('y', function(data){
            return height / 2 - radiusScale(data.value) - 20;    
        })
        .text(data => data.network);
        
    trumpPlots.select('.totals')
        .attr('opacity', 0)

});

cnn_words.then(function(d){

    // group list of words by word
    const word_groups = d3.nest()
        .key(d => d.word)
        .entries(d)

    // count number of occurences for each word
    var word_totals = []
    d3.map(word_groups, function(d){
        
        var entry = {
            word: d.key,
            n: d.values.length
        };
        word_totals.push(entry)
    });

    word_totals = word_totals
        .sort((a, b) => {
            return b.n - a.n
        })
        .slice(0,20)
        .map(function(d){
            return {
                word: d.word,
                n: d.n,
                radius: radiusScale2(d.n)
            };
        });

    var words = [];
    d3.map(word_totals, d => words.push(d.word))

    xScale2.domain([0, 40000]).range([0, width-160])
    yBands.domain(words).padding(0.2)

    var cnnPlots = svgdata.append('g')
        .classed('cnn-plots', true)
        
    // add bars
    cnnPlots.selectAll('.cnnBar')
        .data(word_totals)
        .enter()
        .append('rect')
        .classed('cnnBar', true)
        .attr('width', 0)
        .attr('height', yBands.bandwidth())
        .attr('x', 160)
        .attr('y', d => yBands(d.word))
        .attr('fill', '#111')
        .attr('stroke', colorScale('CNN'))
        .attr('stroke-width', 3)
        .attr('opacity', 1)
        .on('mouseover', mouseover2)
        .on('mousemove', mousemove2)
        .on('mouseleave', mouseleave2);

    // add word labels
    cnnPlots.selectAll('.cnnBarLabel')
        .data(word_totals)
        .enter()
        .append('text')
        .classed('cnnBarLabel', true)
        .attr('text-anchor', 'end')
        .attr('x', d => 150)
        .attr('y', d => yBands(d.word) + yBands.bandwidth() * 0.5 + 5)
        .attr('font-size', 20)
        .attr('fill', 'white')
        .attr('opacity', 0)
        .text(d => d.word);
    
    // add numbers 
    cnnPlots.selectAll('.cnnBarN')
        .data(word_totals)
        .enter()
        .append('text')
        .classed('cnnBarN', true)
        .attr('text-anchor', 'start')
        .attr('x', d => xScale2(d.n) + 170)
        .attr('font-size', 20)
        .attr('fill', 'white')
        .attr('opacity', 0)
        .attr('y', d => yBands(d.word) + yBands.bandwidth() * 0.5 + 5)
        .text(d => d.n.toString().replace(/\w{3}$/, c => ',' + c));
});

headlines.then(function(d){

    const getHeadlines = function(q){
        
        // create arry of headlines
        matches = [];
        
        // iterate through headlines and check for matches until 20 are found
        while (matches.length < 21) {
            d3.map(d, function(d){
    
                // set regex for query and find matching headlines
                var query = new RegExp(q, 'i')
                if (query.test(d.title) == true) {
                    matches.push(d.title);
                };
            });
        };

        console.log(matches)
    };

    // getHeadlines('trump')
});