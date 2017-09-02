(function () {
  var
    timeline = {},
    badgesData = null,
    showImages = false,
    searchQuery = null,
    cumulative = true;

  $(function () {
    $.ajax({
      url: 'https://api.pixels.camp/badges/owners/92',
      dataType: 'json',
      success: function (data) {
        badgesData = data.owners['2017'];
        badgesData.sort(compareDates);
        timeline = toTimeline(badgesData);
        drawGraph(timeline);
        $('#chart > span').hide();
        outputList(badgesData);
      },
      error: function (data) {
        alert('Error retrieving data from the API.');
      }
    });

    $('#showImagesCheck').click(function () {
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

    $('#cumulative').change(function (e) {
      cumulative = !cumulative;
      drawGraph(timeline);
    });
  });

  function compareDates(user1, user2){
  	return ((user1.created < user2.created) ? -1 : (user1.created > user2.created ? 1 : 0));
  }

  function outputList(data = badgesData, query = null, date = null) {
    approvedList = $('#approvedList');
    approvedList.empty();
    for (var each of data) {
      if (query == null || each.user.toLowerCase().includes(query) || each.username.toLowerCase().includes(query)) {
        approvedList.append(
          "<li><a href='https://pixels.camp/" + each.user + "'>" + (showImages ? "<img src='" + each.avatar_url + "'/>" : "") + each.user + "</a> - " + each.username + "<span>" + new Date(each.created).toISOString().substring(0, 10) + "</span></li>"
        );
      }
    }
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

  function drawGraph(timelineData, scaleMax = undefined) {
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
          label: 'Approvals',
          backgroundColor: color(color_blue).alpha(0.5).rgbString(),
          borderColor: color_blue,
          fill: true,
          data: values,
          cubicInterpolationMode: 'monotone'
        }]
      },
      options: {
        title: {
          text: 'Pixel Approvals'
        },
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            type: 'time',
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

    var ctx = $('#canvas')[0].getContext('2d');
    window.chart = new Chart(ctx, config);
  }
})();
