d3.csv('../data/top_albums.csv').then(data => {
    // Call the function that will build the chart.
    // Pass the data to that function.
    createBubbleChart(data);
  });
  
  // Create and append the chart
  const createBubbleChart = (data) => {
    const metrics = ['total_album_consumption_millions', 'album_sales_millions', 'song_sales', 'on_demand_audio_streams_millions', 'on_demand_video_streams_millions'];
    const artists = [];
    

    data.forEach(datum => {
        metrics.forEach(metric => {
           datum[metric] = parseFloat(datum[metric]); // Convert strings to numbers
        });
        artists.push(datum.artist); // Populate the artists array
     });
   
  console.log("data " + JSON.stringify(data));
    // Set the dimensions for the chart
    const margin = {top: 40, right: 0, bottom: 60, left: 40};
    const width = 1160;
    const height = 380;
    const axisPaddding = 300;
    
  
    // Append svg
    const bubbleChart = d3.select('#bubble-chart')
      .append('svg')
        .attr('viewbox', [0, 0, width, height])
        .attr('width', width)
        .attr('height', height);

   let myMax =  d3.max(data, d => d.on_demand_audio_streams_millions);
   
   
    // Create and append x axis - On demand audio streams
    const xScale = d3.scaleLinear()
      .domain([0, myMax + axisPaddding])
      .range([0, width - margin.left - margin.right]);
    bubbleChart                             
      .append('g')
        .attr('transform', `translate(${margin.left},  ${height - margin.bottom})`)
        .call(d3.axisBottom(xScale));
    bubbleChart
      .append('text')
        .attr('text-anchor', 'end')
        .attr('x', width)
        .attr('y', height) 
        .text('On-demand Audio Streams (millions)')
        .style('font-weight', 700)
        .style('font-color', "black");

    // Create and append Y axis - On demand video streams
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.on_demand_video_streams_millions)])
      .range([height - margin.bottom, margin.top]);
      
    bubbleChart
      .append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale));

 bubbleChart
      .append('text')
        .attr('text-anchor', 'start')
        .attr('x',  margin.left)
        .attr('y', 20)
        .text('On-demand Video Streams (millions)')
        .style('font-weight', 700);
    
    // Create scales for the size and color of the bubbles
 const myMaxSales = d3.max(data, d => d.album_sales_millions)

    const rScale = d3.scaleSqrt()
      .domain([0, myMaxSales ])
      .range([0, 30]);
    const colorScale = d3.scaleOrdinal()
      .domain(artists)
      .range(d3.schemeTableau10);
    // Bind data to the circles and position them on the chart
    bubbleChart
      .append('g')
        .attr('class', 'bubbles-group')
      .selectAll('.bubbles-group')
      .data(data)
      .join('circle')
        .attr('cx', d => xScale(d.on_demand_audio_streams_millions))
        .attr('cy', d => yScale(d.on_demand_video_streams_millions))
       .attr('r', d  => rScale(d.album_sales_millions))
       // .attr('r', 10)
        .attr('fill', d => colorScale(d.artist));
       
       
  
  
    // Append color legend
    const colorLegend = d3.select('.legend-color')
      .append('ul')
      .selectAll('li')
      .data(data)
      .join('li')
        .attr('class', 'CLASSNAME');
    colorLegend
      .append('span')
        .attr('class', 'legend-circle')
        .style('background-color', (d, i) => colorScale(d.artist[i]));
    colorLegend
      .append('span')
        .attr('class', 'legend-label')
        .text(d => d.title  + ", " + d.artist);
     
    const viewboxCirclesWidth = 300;
    const viewboxCirclesHeight = 100;
    const rScale1Point5 = rScale(1.5);
    const padding10 = 10;

    // Append area legend
    const areaLegendCircles = d3.select('.legend-area')
      .append('svg')
        .attr('viewbox', [0, 0, viewboxCirclesWidth, viewboxCirclesHeight ])
        .attr('width', viewboxCirclesWidth)
        .attr('height', viewboxCirclesHeight);
  const xCoordSales = (rScale1Point5/2) + 20 // largest circle + padding
    const circlesGroup = areaLegendCircles // I chose to create a group for the circles. This is not mandatory but can help keep the markup organized
      .append('g')
        .attr('class', 'circles-group')
        .attr('fill', '#727a87') // Since I used a group, I can apply the circles styles to the group instead of repeting them for each circle
        .attr('fill-opacity', 0.4); // These styles could also be applied from the CSS stylesheet!
    circlesGroup
      .append('circle')
        .attr('cx', xCoordSales ) 
        .attr('cy', xCoordSales)
        .attr('r', rScale1Point5);
    circlesGroup
      .append('circle')
        .attr('cx', xCoordSales)
        .attr('cy', xCoordSales + (rScale(0.5)/ 2))
        .attr('r', rScale(1));
    circlesGroup
      .append('circle')
        .attr('cx', xCoordSales)
        .attr('cy', xCoordSales + (rScale(1)/2))
        .attr('r', rScale(0.5));
 const lineLength = 80; 
 const linesGroup = areaLegendCircles
      .append('g')
        .attr('class', 'lines-group')
        .attr('stroke', '#333') // Same here, I can apply the lines styles to the group instead of repeating them for each line
        .attr('stroke-dasharray', '6 4');
    linesGroup
      .append('line')
        .attr('x1',  rScale1Point5)
        .attr('y1', 0)
        .attr('x2',  rScale1Point5 + lineLength)
        .attr('y2', 0);
   linesGroup
      .append('line')
        .attr('x1',  rScale1Point5)
        .attr('y1', rScale1Point5/2)
        .attr('x2',  rScale1Point5 + lineLength)
        .attr('y2', rScale1Point5/2);
    linesGroup
      .append('line')
        .attr('x1',  rScale1Point5)
        .attr('y1', rScale1Point5)
        .attr('x2',  rScale1Point5 + lineLength)
        .attr('y2', rScale1Point5);
     
    const labelsGroup = areaLegendCircles
      .append('g')
        .attr('class', 'labels-group')
        .attr('fill', '#333');
    labelsGroup
      .append('text')
        .attr('class', 'label')
        .attr('x',  rScale1Point5 + lineLength )
        .attr('y', padding10)
        .text('1.5M');
   labelsGroup
      .append('text')
        .attr('class', 'label')
        .attr('x',   rScale1Point5 + lineLength)
        .attr('y', rScale1Point5/2 + padding10)
        .text('1M');
    labelsGroup
      .append('text')
        .attr('class', 'label')
        .attr('x',   rScale1Point5 + lineLength)
        .attr('y', rScale1Point5 + padding10)
        .text('0.5M');  
  };
  
  
  
      

  