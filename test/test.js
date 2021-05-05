var parser = require("../");
var fs = require("fs");

var srt = fs.readFileSync("./test/test.srt", { encoding: "utf-8" });

describe("subtitles-parser", function () {
  describe("testing SubRip part", function () {
    var data;

    it("parser.fromVtt() should execute without crashes", function () {
      data = parser.fromVtt(srt);
    });

    it("parser.fromVtt() should return array", function () {
      data.should.be.an.instanceOf(Array);
    });

    it("parser.fromVtt() should contain valid subtitle objects", function () {
      for (var i in data) {
        var s = data[i];

        s.should.have.property("id");
        s.should.have.property("startTime");
        s.should.have.property("endTime");
        s.should.have.property("text");
      }
    });

    var originalData;
    it("parser.toVtt() should execute without crashes", function () {
      originalData = parser.toVtt(data);
    });

    it("parser.toVtt() should convert object back as it was before without changes", function () {
      (srt.trim() === originalData.trim()).should.be.ok;
    });

    var dataMs;
    it("parser.fromVtt() should successfully convert time to second", function () {
      dataMs = parser.fromVtt(srt, "s");
    });

    var originalDataMs;
    it("parser.toVtt() should execute without crashes when using ms", function () {
      originalDataMs = parser.toVtt(data);
    });

    it("parser.fromVtt() should convert object with ms back as it was before without changes", function () {
      (srt.trim() === originalDataMs.trim()).should.be.ok;
    });
  });
});
