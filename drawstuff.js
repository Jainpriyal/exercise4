/* classes */ 

// Color constructor
class Color {
    
        // Color constructor default opaque black
    constructor(r=0,g=0,b=0,a=255) {
        try {
            if ((typeof(r) !== "number") || (typeof(g) !== "number") || (typeof(b) !== "number") || (typeof(a) !== "number"))
                throw "color component not a number";
            else if ((r<0) || (g<0) || (b<0) || (a<0)) 
                throw "color component less than 0";
            else if ((r>255) || (g>255) || (b>255) || (a>255)) 
                throw "color component bigger than 255";
            else {
                this.r = r; this.g = g; this.b = b; this.a = a; 
            }
        } // end try
        
        catch (e) {
            console.log(e);
        }
    } // end Color constructor

        // Color change method
    change(r,g,b,a) {
        try {
            if ((typeof(r) !== "number") || (typeof(g) !== "number") || (typeof(b) !== "number") || (typeof(a) !== "number"))
                throw "color component not a number";
            else if ((r<0) || (g<0) || (b<0) || (a<0)) 
                throw "color component less than 0";
            else if ((r>255) || (g>255) || (b>255) || (a>255)) 
                throw "color component bigger than 255";
            else {
                this.r = r; this.g = g; this.b = b; this.a = a; 
                return(this);
            }
        } // end throw
        
        catch (e) {
            console.log(e);
        }
    } // end Color change method
    
        // Color add method
    add(c) {
        try {
            if (!(c instanceof Color))
                throw "Color.add: non-color parameter";
            else {
                this.r += c.r; this.g += c.g; this.b += c.b; this.a += c.a;
                return(this);
            }
        } // end try
        
        catch(e) {
            console.log(e);
        }
    } // end color add
    
        // Color subtract method
    subtract(c) {
        try {
            if (!(c instanceof Color))
                throw "Color.subtract: non-color parameter";
            else {
                this.r -= c.r; this.g -= c.g; this.b -= c.b; this.a -= c.a;
                return(this);
            }
        } // end try
        
        catch(e) {
            console.log(e);
        }
    } // end color subgtract
    
        // Color scale method
    scale(s) {
        try {
            if (typeof(s) !== "number")
                throw "scale factor not a number";
            else {
                this.r *= s; this.g *= s; this.b *= s; this.a *= s; 
                return(this);
            }
        } // end throw
        
        catch (e) {
            console.log(e);
        }
    } // end Color scale method
    
        // Color copy method
    copy(c) {
        try {
            if (!(c instanceof Color))
                throw "Color.copy: non-color parameter";
            else {
                this.r = c.r; this.g = c.g; this.b = c.b; this.a = c.a;
                return(this);
            }
        } // end try
        
        catch(e) {
            console.log(e);
        }
    } // end Color copy method
    
        // Color clone method
    clone() {
        var newColor = new Color();
        newColor.copy(this);
        return(newColor);
    } // end Color clone method
    
        // Send color to console
    toConsole() {
        console.log(this.r +" "+ this.g +" "+ this.b +" "+ this.a);
    }  // end Color toConsole
    
} // end color class


/* utility functions */

// draw a pixel at x,y using color
function drawPixel(imagedata,x,y,color) {
    try {
        if ((typeof(x) !== "number") || (typeof(y) !== "number"))
            throw "drawpixel location not a number";
        else if ((x<0) || (y<0) || (x>=imagedata.width) || (y>=imagedata.height))
            throw "drawpixel location outside of image";
        else if (color instanceof Color) {
            var pixelindex = (y*imagedata.width + x) * 4;
            imagedata.data[pixelindex] = color.r;
            imagedata.data[pixelindex+1] = color.g;
            imagedata.data[pixelindex+2] = color.b;
            imagedata.data[pixelindex+3] = color.a;
        } else 
            throw "drawpixel color is not a Color";
    } // end try
    
    catch(e) {
        console.log(e);
    }
} // end drawPixel


/* application functions */

// interpolate and draw between two edges
// draws only in the y range occupied by both edges
// expects two left and right edge parameters, each a two element array of objects
// the first object in each edge is the upper endpoint, the second the lower
// vertex objects have this structure: {x:float,y:float,c:Color}
function twoEdgeInterp(imagedata,e1,e2) {
    
    // determine left/right edges
    if (Math.min(e1[0].x,e1[1].x) < Math.min(e2[0].x,e2[1].x))
        var le = e1, re = e2;
    else
        var le = e2, re = e1; 
    
    // ensure vertex with min y is first
    le = (le[0].y < le[1].y) ? le : le.reverse(); 
    re = (re[0].y < re[1].y) ? re : re.reverse(); 
    
    // setup interp begin for different starting Ys
    var startYDiff = le[0].y - re[0].y;
    if (startYDiff > 0) { // left edge has largest min Y
        var startAtT = startYDiff/(re[1].y - re[0].y); // start at param t
        var startAtY = Math.ceil(le[0].y); // start at min Y
        var lx = Math.ceil(le[0].x); // left x
        var lc = le[0].c.clone();  // left color
        var rx = re[0].x + (re[1].x-re[0].x) * startYDiff/(re[1].y - re[0].y); // right x
        var rc = re[1].c.clone().subtract(re[0].c).scale(startAtT).add(re[0].c);  // right color
    } else { // right edge has largest min Y
        var startAtT = -startYDiff/(le[1].y - le[0].y); // start at param t
        var startAtY = Math.ceil(re[0].y); // start at min Y
        var lx = Math.ceil(le[0].x + (le[1].x-le[0].x) * startAtT); // left x
        var lc = le[1].c.clone().subtract(le[0].c).scale(startAtT).add(le[0].c);  // left color
        var rx = re[0].x; // right x
        var rc = re[0].c.clone();  // right color
    } // end if right edge has largest min Y

    // set up the vertical interpolation
    var haltAtY = Math.min(le[1].y,re[1].y); // Y at which to stop interpolation
    var vDelta = 1 / (haltAtY-startAtY); // norm'd vertical delta
    var lcDelta = le[1].c.clone().subtract(le[0].c).scale(vDelta); // left vertical color delta
    var rcDelta = re[1].c.clone().subtract(re[0].c).scale(vDelta); // right vertical color delta
    var lxDelta = (le[1].x - le[0].x) * vDelta; // left vertical x delta
    var rxDelta = (re[1].x - re[0].x) * vDelta; // right vertical x delta
    
    // set up the horizontal interpolation
    var hDelta = 1 / (rx-lx); // norm'd horizontal delta
    var hc = new Color(); // horizontal color
    var hcDelta = new Color(); // horizontal color delta
    
    // do the interpolation
    for (var y=startAtY; y<=haltAtY; y++) {
        hc.copy(lc); // begin with the left color
        hcDelta.copy(rc).subtract(lc).scale(hDelta); // reset horiz color delta
        for (var x=Math.ceil(lx); x<=rx; x++) {
            drawPixel(imagedata,x,y,hc);
            hc.add(hcDelta);
        } // end horizontal
        lc.add(lcDelta);
        rc.add(rcDelta);
        lx += lxDelta;
        rx += rxDelta; 
    } // end vertical
} // end twoEdgeInterp

// fills the passed convex polygon
// expects an array of vertices, listed in clockwise order
// vertex objects have this structure: {x:float,y:float,c:Color}
function fillPoly(imagdata,vArray) {
    
    // compares the edges starting at v1 and v2
    // an edge is formed by the passed and subsequent vertices (with wrapping)
    // expects two vertex indices into vArray
    function compareYofEdges(v1,v2) {
        
        var e1MinY = Math.min(vArray[v1].y,vArray[(v1+1)%vArray.length].y);
        var e2MinY = Math.min(vArray[v2].y,vArray[(v2+1)%vArray.length].y);
        
        return(Math.sign(e1MinY-e2MinY));
    } // end compareEdgeY
    
    // true if the passed edge is horizontal
    function edgeNotHorizontal(vtx,i,a) {
        
        return(vArray[vtx].y != vArray[(vtx+1)%vArray.length].y);
    } // end edgeHorizontal
    
    // sort the edges in the polygon by their min y coordinate
    // then loop through edges, interpolating between current two min edges
    // ignore any horizontal edges
    var sortedEdges = Object.keys(vArray).sort(compareYofEdges); // sort edges by min y
    var sortedNoHzEdges = sortedEdges.filter(edgeNotHorizontal); // remove all horizontal edges
    var e1 = 0, e2 = 1; // begin with first two edges
    do { // while there are still edges to interpolate between        
        // identify edge with lower max y
        // interpolate between the edge with lower max y and other edge
        // introduce next edge
        // identify left and right edge
    } while (e2 < numVerts); // end for each edge
} // end fillPoly
    

/* main -- here is where execution begins after window load */

function main() {

    // Get the canvas, context, and image data
    var canvas = document.getElementById("viewport"); 
    var context = canvas.getContext("2d");
    var w = context.canvas.width; // as set in html
    var h = context.canvas.height;  // as set in html
    var imagedata = context.createImageData(w,h);
 
    // Define and render a rectangle in 2D with colors and coords at corners
    twoEdgeInterp(imagedata,
        [{x:50,y:0,c:new Color(255,0,0,255)}, {x:100,y:200,c:new Color(0,0,255,255)}],
        [{x:150,y:100,c:new Color(0,255,0,255)}, {x:250,y:300,c:new Color(0,0,0,255)}]);
    
    context.putImageData(imagedata, 0, 0); // display the image in the context
}
