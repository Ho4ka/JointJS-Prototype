const allCells = {};

const getData = () => {
    return fetch('https://api.myjson.com/bins/10fe7k').then(res => res.json());
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

    connections.forEach(connectionConfig => {
        const source = allCells[connectionConfig.source.componentId];
        const target = allCells[connectionConfig.target.componentId];
        const from = connectionConfig.source.port;
        const to = connectionConfig.target.port;

        link(source, target, from, to);
    });

};

getData().then(buildGraph);

var graph = new joint.dia.Graph;

var paper = new joint.dia.Paper({
    el: $('#paper'),
    width: "100%",
    height: 1000,
    gridSize: 15,
    drawGrid: {name: 'mesh', args: {thickness: 1, color: '#ECEBEC'}},
    model: graph,
    elementView: joint.dia.ElementView.extend({
        pointerdblclick: function (evt, x, y) {
            this.model.remove();
        }
    }),
    linkView: joint.dia.LinkView.extend({
        pointerdblclick: function (evt, x, y) {
            this.model.remove();
        }
    })

});

//
// paper.on('cell:mouseover', function (cellView, evt) {
//     showTools(cellView.model);
// });
paper.on('cell:mouseout', function (cellView, evt) {
    hideTools();
});
paper.on('cell:contextmenu', function (cellView, evt) {
    showContextMenu(evt);
});

var Figure = joint.shapes.basic.Generic.extend({
    markup: '<g class="rotatable"><g class="scalable"><rect class="outer"/><rect class="inner"/></g><text class="label"/><text class="sheet"/></g>',

    defaults: joint.util.deepSupplement({

        type: 'figure',

        attrs: {
            '.outer': {
                fill: '#2E75B6',
                width: 120,
                height: 60
            },
            '.inner': {
                fill: '#FFFFFF',
                'ref-x': 3,
                'ref-y': 3,
                width: 112,
                height: 51
            },
            '.label': {
                fill: '#0D0D0D',
                text: 'Hello',
                'font-size': 20,
                'ref-x': 0.5,
                'ref-y': 0.55,
                'text-anchor': 'middle',
                'y-alignment': 'middle',
                'font-family': 'Tahoma, Arial, helvetica, sans-serif',
                'font-weight': 'bold'
            },
        }

    }, joint.shapes.basic.Generic.prototype.defaults)
});


function hideTools()
{
    this.$tools.css('display', 'none');
}

function showContextMenu(evt)
{
    this.$contextMenu.jqxMenu('open', evt.pageX, evt.pageY);
}



this.$tools = $('<div class="toolbar">');
this.$tools.append('<div class="tools tools-delete"><i class="fa fa-times"></i></div>');
this.$tools.append('<div class="tools tools-clearlink"><i class="fa fa-chain-broken"></i></div>');
this.$tools.append('<div class="tools tools-newnext"><i class="fa fa-random"></i></div>');
this.$tools.append('<div class="tools tools-link"><i class="fa fa-arrow-right"></i></div>');
this.$tools.append('<div class="tools tools-duplicate"><i class="fa fa-plus"></i></div>');
this.$tools.css({
    display: 'none'
});
$('.paper').append(this.$tools);

this.$contextMenu = $('' +
    '<div class="context-menu">' +
    '<ul>' +
    '<li id = "process">Add Block' +

    '</li>' +
    '<li id = "process">Rename' +

    '</li>' +
    '<li id = "cancel">Delete</li>' +
    '</ul>' +
    '</div>');
$('.paper').append(this.$contextMenu);
this.$contextMenu.jqxMenu({
    width: '200px',
    autoOpenPopup: false,
    animationShowDuration: 0,
    animationHideDuration: 0,
    mode: 'popup'
});

$(document).on('contextmenu', function (e) {
    return false;
});



function state(x, y, label) {

    let cell = new joint.shapes.basic.Rect({

        position: {x: x, y: y},
        size: {width: 200, height: 100},
        attrs: {
            rect: {fill: '#BAC6CD', stroke: "white"},
            text: {text: label, fontWeight: 'bold', fontFamily: 'helvetica, sans-serif', letterSpacing: '1px'}
        },

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

function link(source, target, from, to) {

    var cell = new joint.shapes.standard.Link({

        source: {id: source.id},
        target: {id: target.id},

        labels: [{
            markup: '<rect/><text/><defs></defs>',
            attrs: {
                text: {
                    text: 'From: ' + from || '',
                    fill: 'black',
                    textAnchor: 'start',
                    refX: '-45%',
                    refY: '15%',
                    fontFamily: 'helvetica, sans-serif',
                    fontWeight: 'bold',
                    wordSpacing:'20px',
                    fontSize: 11,
                    cursor: 'pointer'
                },
                rect: {
                    fill: 'white',
                    refWidth: '100%',
                    refHeight: '100%',
                    refX: '-50%',
                    refY: '-10%',
                    rx: 1,
                    ry: 1,
                }
            },
            size: {
                width: 150, height: 20
            },

        },
            {
                markup: '<rect/><text/><defs></defs>',
                attrs: {
                    text: {
                        text: 'To: ' + to || '',
                        fill: 'black',
                        textAnchor: 'start',
                        refX: '-45%',
                        refY: '-87%',
                        fontWeight: 'bold',
                        wordSpacing:'35px',
                        fontFamily: 'helvetica, sans-serif',
                        fontSize: 11,
                        cursor: 'pointer'
                    },
                    rect: {
                        fill: '#EDEFF0',
                        refWidth: '100%',
                        refHeight: '100%',
                        refX: '-50%',
                        refY: '-111%',
                        rx: 1,
                        ry: 1,
                    }
                },
                size: {
                    width: 150, height: 20
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
