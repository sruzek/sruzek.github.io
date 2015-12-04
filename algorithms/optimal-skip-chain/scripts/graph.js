//data structure to hold the graph
//based off of http://graphdracula.net code but without jquery



var AbstractEdge = function() { }
AbstractEdge.prototype = { }; 

var EdgeFactory = function() {
    var material = new THREE.LineBasicMaterial({ color: 0x0000ff });
    var geometry = new THREE.Geometry();
    geometry.vertices.push(
        new THREE.Vector3( -10, 0, 0 ),
        new THREE.Vector3( 0, 10, 0 ),
        new THREE.Vector3( 10, 0, 0 )
    );
    this.template = new AbstractEdge();
    this.template.style = new Object();
    this.template.style.directed = false;
    this.template.weight = 1;
};
EdgeFactory.prototype = {
    build: function(source, target) {
        var material = new THREE.LineBasicMaterial({ color: 0x0000ff });
        var geometry = new THREE.Geometry();
    	var e = new THREE.Object3D();
        e.source = source;
        e.target = target;
        return e;
    }
};


var Graph = function() {
    this.nodes = {};
    this.edges = [];
    this.snapshots = []; // previous graph states TODO to be implemented
    this.edgeFactory = new EdgeFactory();
};

Graph.prototype = {
    /* 
     * add a node
     * @id          the node's ID (string or number)
     * @content     (optional, dictionary) can contain any information that is
     *              being interpreted by the layout algorithm or the graph
     *              representation
     */
    addNode: function(id, content) {
        /* testing if node is already existing in the graph */
        if(this.nodes[id] == undefined) {
            this.nodes[id] = new Graph.Node(id, content);
        }
        return this.nodes[id];
    },

    addEdge: function(source, target, style) {
        var s = this.addNode(source);
        var t = this.addNode(target);
        var edge = this.edgeFactory.build(s, t);
        // jQuery.extend(edge.style,style);
        s.edges.push(edge);
        this.edges.push(edge);
        // NOTE: Even directed edges are added to both nodes.
        t.edges.push(edge);
    },
    
    /* TODO to be implemented
     * Preserve a copy of the graph state (nodes, positions, ...)
     * @comment     a comment describing the state
     */
    snapShot: function(comment) {
        /* FIXME
        var graph = new Graph();
        graph.nodes = jQuery.extend(true, {}, this.nodes);
        graph.edges = jQuery.extend(true, {}, this.edges);
        this.snapshots.push({comment: comment, graph: graph});
        */
    },
    removeNode: function(id) {
        delete this.nodes[id];
        for(var i = 0; i < this.edges.length; i++) {
            if (this.edges[i].source.id == id || this.edges[i].target.id == id) {
                this.edges.splice(i, 1);
                i--;
            }
        }
    }
};


/*
 * Node
 */
Graph.Node = function(id, node){
    node = node || {};
    node.id = id;
    node.edges = [];
    node.hide = function() {
        this.hidden = true;
        this.shape && this.shape.hide(); /* FIXME this is representation specific code and should be elsewhere */
        for(i in this.edges)
            (this.edges[i].source.id == id || this.edges[i].target == id) && this.edges[i].hide && this.edges[i].hide();
    };
    node.show = function() {
        this.hidden = false;
        this.shape && this.shape.show();
        for(i in this.edges)
            (this.edges[i].source.id == id || this.edges[i].target == id) && this.edges[i].show && this.edges[i].show();
    };
    return node;
};
Graph.Node.prototype = {
};


