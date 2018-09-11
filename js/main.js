const allCells = {};

const getData = () => {
    return fetch('https://api.myjson.com/bins/1h3g28').then(res => res.json());
};

const buildGraph = (data) => {
    buildComponents(data.components);
    buildLinks(data.connections);
};

const buildComponents = (components) => {
    components.forEach(compConfig => {
        const rect = state(compConfig.position.x, compConfig.position.y, compConfig.name);
        allCells[compConfig.id] = rect;
    });
};

const buildLinks = (connections) => {
    console.log(connections);

    connections.forEach(connectionConfig => {
        const source = allCells[connectionConfig.source.componentId];
        const target = allCells[connectionConfig.target.componentId];
        const label = 'From: ' + connectionConfig.source.port + '\n' + 'To: ' + connectionConfig.target.port;

        link(source, target, label);
    });

};

getData().then(buildGraph);

var graph = new joint.dia.Graph;

var paper = new joint.dia.Paper({
    el: $('#paper'),
    width: "100%",
    height: 1000,
    gridSize: 15,
    drawGrid: { name: 'mesh', args: { thickness: 1,color: '#ECEBEC'  }},
    model: graph,

});

function state(x, y, label) {

    let cell = new joint.shapes.basic.Rect({

        position: { x: x, y: y },
        size: { width: 200, height: 100 },
        attrs: {
            rect: { fill: '#BAC6CD', stroke: 'rgb(236, 235, 236)' },
            text : { text: label, fontWeight:'bold', fontFamily: 'helvetica, sans-serif',letterSpacing: '1px'}},

    });

    cell.attr('rect/filter', {
        name: 'dropShadow',
        args: {
            dx: 0,
            dy: 0,
            blur: 1
        }
    });

    graph.addCell(cell);
    return cell;
}

function link(source, target, label) {

    var cell = new joint.shapes.standard.Link({

        source: { id: source.id },
        target: { id: target.id },


        labels:  [{
            markup: '<rect/><text/><defs>\n' +
                '<linearGradient id="half" x1="0%" y1="0%" x2="0%" y2="100%">\n' +
                '<stop offset="0%" stop-color="#EDEFF0" />\n' +
                '<stop offset="50%" stop-color="#EDEFF0" />\n' +
                '<stop offset="50%" stop-color="white" />\n' +
                '<stop offset="100%" stop-color="white" />\n' +
                '</linearGradient>\n' +
                '</defs>',
            attrs: {
                text: { text: label || '',
                    fill: 'black',
                    textAnchor: 'start',
                    refX: '-45%',
                    refY: '-35%',
                    fontFamily: 'helvetica, sans-serif',
                    fontSize: 11,
                    cursor: 'pointer'
                },
                rect: {
                    fill: 'url(#half)',
                    stroke: 'gray',
                    strokeWidth: 1,
                    refWidth: '100%',
                    refHeight: '100%',
                    refX: '-50%',
                    refY: '-50%',
                    rx: 1,
                    ry: 1,
                }
            },
            size: {
                width: 150, height: 30
            }
        },
            {
                markup: '<rect/><text/><defs>\n' +
                    '<linearGradient id="half" x1="0%" y1="0%" x2="0%" y2="100%">\n' +
                    '<stop offset="0%" stop-color="#EDEFF0" />\n' +
                    '<stop offset="50%" stop-color="#EDEFF0" />\n' +
                    '<stop offset="50%" stop-color="white" />\n' +
                    '<stop offset="100%" stop-color="white" />\n' +
                    '</linearGradient>\n' +
                    '</defs>',
                attrs: {
                    text: { text: label || '',
                        fill: 'black',
                        textAnchor: 'start',
                        refX: '-45%',
                        refY: '-135%',
                        fontFamily: 'helvetica, sans-serif',
                        fontSize: 11,
                        cursor: 'pointer'
                    },
                    rect: {
                        fill: 'url(#half)',
                        stroke: 'gray',
                        strokeWidth: 1,
                        refWidth: '100%',
                        refHeight: '100%',
                        refX: '-50%',
                        refY: '-150%',
                        rx: 1,
                        ry: 1,
                    }
                },
                size: {
                    width: 150, height: 30
                }
            }]
    });



    cell.attr('rect/filter', {
        name: 'dropShadow',
        args: {
            dx: 0,
            dy: 0,
            blur: 1
        }
    });

    graph.addCell(cell);
    return cell;
}

