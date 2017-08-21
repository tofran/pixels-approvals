(function () {
  var timeline = {}, badgesData = null, showImages = false, searchQuery = null;
  
  $(function () {
    $.ajax({
      url: 'https:/api.pixels.camp/badges/owners/92',
      dataType: 'json',
      success: function (data) {
        badgesData = data.owners['2017'];
        timeline = toTimeline(badgesData);
        drawGraph(timeline);
        outputList(badgesData);
      },
      error: function (data) {
        alrt("Error retrieving data from tehe API.");
      }
    });
    $("#showImagesCheck").click(function () {
      showImages = !showImages;
      outputList(badgesData, searchQuery);
    });

    $('#searchBox').keyup(function () {
      var newQuery = $('#searchBox').val().trim().toLowerCase();
      if (newQuery !== searchQuery) {
        searchQuery = newQuery;
        outputList(badgesData, searchQuery);
      }
    });
  });

  function outputList(data = badgesData, query = null, date = null) {
    approvedList = $('#approvedList');
    approvedList.empty();
    data.forEach(function (each) {
      if (query == null || each.user.toLowerCase().includes(query) || each.username.toLowerCase().includes(query)) {
        approvedList.append(
          "<li><a href='https://pixels.camp/" + each.user + "'>" + (showImages ? "<img src='" + each.avatar_url + "'/>" : "") + each.user + "</a><span>" + each.created + "</span></li>"
        );
      }
    });
  }

  function toTimeline(badges) {
    var tml = {};
    for (var each of badges) {
      var day = each.created.substring(0, 10).replace('-', '');
      if (!(day in tml)) {
        tml[day] = [];
      }
      tml[day].push(each.user);
    }
    return tml;
  }

  function drawGraph(timelineData, cumulative = true, scaleMax = undefined) {
    var values = [], cum = 0;

    for (var element of Object.values(timelineData)) {
      if (!cumulative) {
        cum = 0;
      }
      cum += element.length
      values.push(cum);
    }

    var color = Chart.helpers.color;
    var color_blue = 'rgb(54, 162, 235)';
    var config = {
      type: 'line',
      data: {
        labels: Object.keys(timelineData),
        datasets: [{
          label: "Approvals",
          backgroundColor: color(color_blue).alpha(0.5).rgbString(),
          borderColor: color_blue,
          fill: true,
          data: values,
          cubicInterpolationMode: 'monotone'
        }]
      },
      options: {
        title: {
          text: "Pixel Approvals"
        },
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            type: "time",
            time: {
              format: 'YYYYMMDD',
              tooltipFormat: 'MMM DD',
              unit: 'day',
              unitStepSize: 1,
              displayFormats: {
                millisecond: 'MMM DD',
                second: 'MMM DD',
                minute: 'MMM DD',
                hour: 'MMM DD',
                day: 'MMM DD',
                week: 'MMM DD',
                month: 'MMM DD',
                quarter: 'MMM DD',
                year: 'MMM DD',
              }
            },
            scaleLabel: {
              display: true,
              labelString: 'Date'
            },
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Approvals',
            },
            ticks: {
              max: scaleMax,
              min: 0
            }
          }]
        },
      }
    };

    var ctx = $("#canvas")[0].getContext("2d");
    window.chart = new Chart(ctx, config);
  }
})();
