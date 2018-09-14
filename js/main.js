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

        className: 'some-custom-class',
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


$(function() {
    $.contextMenu({
        selector: '#paper',
        callback: function(key, options) {
            var m = "clicked: " + key;
            window.console && console.log(m) || alert(m);
        },
        items: {
            "edit": {name: "Add block", icon: "add"},

            "sep1": "---------",
            "quit": {name: "Quit", icon: function(){
                    return 'context-menu-icon context-menu-icon-quit';
                }}
        }
    });

    $('.context-menu-one').on('click', function(e){
        console.log('clicked', this);
    })
});


$(function() {
    $.contextMenu({
        selector: 'rect',
        callback: function(key, options) {
            var m = "clicked: " + key;
            window.console && console.log(m) || alert(m);
        },
        items: {
            "edit": {name: "Edit", icon: "edit"},
            "cut": {name: "Cut", icon: "cut"},
            copy: {name: "Copy", icon: "copy"},
            "paste": {name: "Paste", icon: "paste"},
            "delete": {name: "Delete", icon: "delete"},
            "sep1": "---------",
            "quit": {name: "Quit", icon: function(){
                    return 'context-menu-icon context-menu-icon-quit';
                }}
        }
    });

    $('.context-menu-one').on('click', function(e){
        console.log('clicked', this);
    })
});


$(function() {
    $.contextMenu({
        selector: 'g',
        callback: function(key, options) {
            var m = "clicked: " + key;
            window.console && console.log(m) || alert(m);
        },
        items: {

            "delete": {name: "Delete", icon: "delete"},
            "sep1": "---------",
            "quit": {name: "Quit", icon: function(){
                    return 'context-menu-icon context-menu-icon-quit';
                }}
        }
    });

    $('.context-menu-one').on('click', function(e){
        console.log('clicked', this);
    })
});