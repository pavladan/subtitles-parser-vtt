var parser = (function () {
  var pItems = {};

  /**
   * Converts SubRip subtitles into array of objects
   * [{
   *     id:        `Number of subtitle`
   *     startTime: `Start time of subtitle`
   *     endTime:   `End time of subtitle
   *     text: `Text of subtitle`
   * }]
   *
   * @param  {String}  data SubRip suntitles string
   * @param  {Boolean} ms   Optional: use milliseconds for startTime and endTime
   * @return {Array}
   */
  pItems.fromVtt = function (data, timeFormat, isYoutubeAutoTranscript) {
    var useYoutubeAutoTranscript = isYoutubeAutoTranscript ? true : false;
    data = data.replace(/\r/g, "");
    var regex = /(\d+)?\n?(\d{2}:\d{2}:\d{2}[,.]\d{3}) --> (\d{2}:\d{2}:\d{2}[,.]\d{3}).*\n/g;
    data = data.split(regex);
    data.shift();
    var items = [];
    for (var i = 0; i < data.length; i += 4) {
      var text = data[i + 3];
      if (useYoutubeAutoTranscript) {
        text = text.split("\n");
        text.shift();
        text = text.join("\n");
      }
      if (text.trim().length === 0) continue;
      items.push({
        id: data[i] ? +data[i].trim() : items.length + 1,
        startTime: changeTimeFormat(data[i + 1].trim(), timeFormat),
        endTime: changeTimeFormat(data[i + 2].trim(), timeFormat),
        text: text.trim(),
      });
    }
    return items;
  };

  /**
   * Converts Array of objects created by this module to SubRip subtitles
   * @param  {Array}  data
   * @return {String}      SubRip subtitles string
   */
  pItems.toVtt = function (data) {
    if (!data instanceof Array) return "";
    var res = "";

    for (var i = 0; i < data.length; i++) {
      var s = data[i];

      if (!isNaN(s.startTime) && !isNaN(s.endTime)) {
        s.startTime = msTime(parseInt(s.startTime, 10));
        s.endTime = msTime(parseInt(s.endTime, 10));
      }

      res += s.id + "\r\n";
      res += s.startTime + " --> " + s.endTime + "\r\n";
      res += s.text.replace("\n", "\r\n") + "\r\n\r\n";
    }

    return res;
  };

  var changeTimeFormat = function (time, format) {
    if (format === "ms") {
      return timeMs(time);
    } else if (format === "s") {
      return timeMs(time) / 1000;
    } else {
      return time;
    }
  };

  var timeMs = function (val) {
    var regex = /(\d+):(\d{2}):(\d{2})[,.](\d{3})/;
    var parts = regex.exec(val);

    if (parts === null) {
      return 0;
    }

    for (var i = 1; i < 5; i++) {
      parts[i] = parseInt(parts[i], 10);
      if (isNaN(parts[i])) parts[i] = 0;
    }

    // hours + minutes + seconds + ms
    return parts[1] * 3600000 + parts[2] * 60000 + parts[3] * 1000 + parts[4];
  };

  var msTime = function (val) {
    var measures = [3600000, 60000, 1000];
    var time = [];

    for (var i in measures) {
      var res = ((val / measures[i]) >> 0).toString();

      if (res.length < 2) res = "0" + res;
      val %= measures[i];
      time.push(res);
    }

    var ms = val.toString();
    if (ms.length < 3) {
      for (i = 0; i <= 3 - ms.length; i++) ms = "0" + ms;
    }

    return time.join(":") + "," + ms;
  };

  return pItems;
})();

// ignore exports for browser
if (typeof exports === "object") {
  module.exports = parser;
}
