var should = require("should");
var helper = require("node-red-node-test-helper");
var request = require('request');
var node = require("../node.js");

helper.init(require.resolve('node-red'));

describe('image-segmenter node', function () {

    before(function (done) {
        helper.startServer(done);
    });

    after(function (done) {
        helper.stopServer(done);
    });

    afterEach(function () {
        helper.unload();
    });

    it('should be loaded', function (done) {
        var flow = [{ id: "n1", type: "image-segmenter", name: "image-segmenter" }];
        helper.load(node, flow, function () {
            var n1 = helper.getNode("n1");
            n1.should.have.property('name', 'image-segmenter');
            done();
        });
    });

    it('should have payload', function (done) {
        var flow = [
            { id: "n1", type: "image-segmenter", name: "image-segmenter", wires: [["n2"]] },
            { id: "n2", type: "helper" }
        ];
        helper.load(node, flow, function () {
            var n2 = helper.getNode("n2");
            var n1 = helper.getNode("n1");
            n2.on("input", function (msg) {
                msg.should.have.property('payload', ["background","potted plant","person"]); // (2) define output message
                done();
            });
            request('https://raw.githubusercontent.com/IBM/MAX-Image-Segmenter/master/assets/stc.jpg', { encoding: null }, function (error, response, body) {
                n1.receive({ payload: Buffer.from(body) }); // (1) define input message
            });
        });
    });
});

