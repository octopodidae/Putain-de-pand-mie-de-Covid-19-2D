require([
  "esri/Map",
  "esri/layers/CSVLayer",
  "esri/views/MapView",
  "esri/widgets/Legend"
], function (Map, CSVLayer, MapView, Legend) {
  $(document).ready(function () {
    //
    const url =
      "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
    //
    // const url2 ="https://github.com/CSSEGISandData/COVID-19/blob/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv;"
    //
    const defaultSym = {
      type: "simple-marker",
      color: [113, 222, 110, 0.5],
      outline: {
        color: "#71de6e",
        width: 1
      }
    };
    //
    const renderer = {
      type: "simple",
      symbol: {
        type: "simple-marker",
        color: [0, 0, 0, 0],
        outline: {
          color: [0, 0, 0, 0],
          width: 1
        }
      }
    };
    //
    const map = new Map({
      basemap: "dark-gray"
    });
    //
    const view = new MapView({
      container: "viewDiv",
      map: map
    });
    //
    view.ui.move(["compass", "zoom"], "top-right");
    //
    view.ui.remove("attribution");
    //
    const legendDiv = document.getElementById("legendDiv");
    const displayDate = document.getElementById("displayDate");
    const progressBar = $("#progressBar");
    const myPanel = $("#myPanel");
    // const btnStart = $(".ui.button.circular");
    //
    // function startAnimation(){
    //   btnStart.click(function(){
    //     let radioValue = $("input[name='csvFile']:checked").val();
    //     console.log("radioValue", radioValue)
    //   })
    // }
    //
    function addLegend(layer) {
      return new Legend({
        view: view,
        container: legendDiv,
        layerInfos: [
          {
            layer: layer,
            title: "Légende"
          }
        ]
      });
    }
    //
    function createLayer() {
      return new CSVLayer({
        url: url,
        renderer: renderer,
        outFields: ["*"],
        title: "time_series_covid19_confirmed_global",
        id: "time_series_covid19_confirmed_global"
      });
    }
    //
    function addLayer() {
      let layer = createLayer();
      view.map.add(layer);
      return layer;
    }
    //
    function createTimeSlider(defaultSym, dateCov, layer) {
      // maxVal
      let rendererProgress = {
        type: "simple",
        symbol: defaultSym,
        visualVariables: [
          {
            type: "size",
            field: dateCov,
            stops: [
              {
                value: 0,
                size: 0,
                label: ""
              },
              {
                value: 10000,
                size: 14,
                label: "> 10000"
              },
              {
                value: 1000000,
                size: 28,
                label: "> 1000000"
              },
              {
                value: 2000000,
                size: 48,
                label: "> 2000000"
              },
              {
                value: 10000000,
                size: 72,
                label: "> 10000000"
              }
            ]
          }
        ]
      };
      layer.renderer = rendererProgress;
    }
    //
    function configProgressBar(nbDate) {
      progressBar.attr("data-total", nbDate);
    }
    //
    function animateProgressBar() {
      progressBar.progress("increment");
    }
    //
    function animateTimeSlider(layer) {
      layer
        .queryFeatures()
        .then(function (results) {
          configProgressBar(
            Object.keys(results.features[0].attributes).length - 1
          );
          // console.log("results.features", results.features);
          return results.features;
        })
        // .then(function (resp) {
        //   let maxVal = 0;
        //   let yesterday = moment().subtract(1, "day").format("M/D/YY");
        //   // console.log("yesterday", yesterday);
        //   maxVal = Math.max.apply(
        //     Math,
        //     resp.map(function (o) {
        //       return o.attributes[yesterday];
        //     })
        //   );
        //   // console.log("maxVal", maxVal);
        //   maxVal = parseInt(maxVal.toString().substring(0, 2) + "000000");
        //   return maxVal;
        // }) // return maxVal
        .then(function () {
          //maxVal
          for (var i = 5; i < layer.fields.length; i++) {
            // console.log("layer.fields.length", layer.fields.length);
            (function (ind) {
              setTimeout(function () {
                myPanel.show();
                // console.log("maxVal", maxVal);
                // console.log("layer", layer);
                // console.log("ind", ind);
                let dateCov = layer.fields[ind].alias;
                // console.log(dateCov);
                let dateCovDisplay = moment.locale("fr");
                dateCovDisplay = moment(dateCov, "M/D/YY").format("LL");
                /*dateCovDisplay = moment(dateCov, "M/D/YY").format("l");
                console.log("dateCovDisplay", dateCovDisplay);
                dateCovDisplay = dateCovDisplay.split("/");
                let newDate = new Date( dateCovDisplay[2], dateCovDisplay[1] - 1, dateCovDisplay[0]);
                let tms1 = newDate.getTime();
                console.log("tms1", tms1);
                let dateM1day = new Date();
                dateM1day.setDate(dateM1day.getDate() -1);
                let tms2 = dateM1day.getTime();
                console.log("tms2", tms2);*/
                displayDate.textContent = "Cas de COVID19 au " + dateCovDisplay;
                animateProgressBar();
                // console.log("dateCov", dateCov);
                createTimeSlider(defaultSym, dateCov, layer);
                //
                /*if (ind === layer.fields.length - 1) {
                  layer.popupTemplate = {
                    title: "{Country/Region}",
                    outFields: ["*"],
                    content: function (feature) {
                      let p = document.createElement("p");
                      // console.log("feature.graphic.attributes[dateCov]", feature.graphic.attributes[dateCov]);
                      p.innerHTML =
                        "Nombre de cas au " +
                        dateCovDisplay +
                        " : " +
                        feature.graphic.attributes[dateCov];
                      return p;
                    }
                    // [
                    //   {type: "fields",
                    //     fieldInfos: [
                    //       {
                    //         fieldName: "{dateCov}",
                    //         label: ""
                    //       },
                    //       // {
                    //       //   fieldName: "B12001_calc_numMarriedE",
                    //       //   label: "People Married",
                    //       //   format: {
                    //       //     digitSeparator: true,
                    //       //     places: 0
                    //       //   }
                    //       // }
                    //     ]
                    //   }
                    // ]
                  };
                  console.log("It was the last one");
                }*/
              }, 100 * ind);
            })(i);
          }
        }); // annimate
    }
    //
    view
      .when(function () {})
      .then(addLayer)
      .then(function (layer) {
        layer
          .when(function () {
            addLegend(layer);
            return layer.queryExtent();
          })
          .then(function (response) {
            view.goTo(response.extent);
          })
          .then(animateTimeSlider(layer));
      });
    //
  });
});
