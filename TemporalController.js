var TemporalController = require('TemporalAnalysis/src/TemporalController')
var Self = function ($rootScope, $scope, Path, DataService, TemporalService) {
  TemporalController.call(this, $rootScope, $scope, TemporalService, DataService, Path)
  var self = this

  self.valueFormatter = function (d) { return d3.format('$0,000')(parseFloat(d.toFixed(2))) }
}
Self.prototype = Object.create(TemporalController.prototype)

//override temporalModule.TemporalController.update
Self.prototype.update = function () {
  var self = this

  self.item = self.item || self.DataService.items[0]
  self.keyParser = self.groupingOption.keyParse
  self.dateFormatter = self.TemporalService.getFormatter(self.intervalOption, self.groupingOption)
  if (self.comparisons.weekDay = !!self.groupingOption.weekDay) {
    var weekDayFilter = self.TemporalService.weekDayFilter(self.groupingOption.name)
    , filterer = function (d) { return weekDayFilter(d.date) }
  }
  //Include only full intervals
  var fitInterval = self.intervalOption.interval.floor(self.groupingOption.name)
  //to include non-complete period empty data should be set
  //fitInterval.end = d3.time[self.groupingOption.name].ceil(self.intervalOption.interval.end)
  
  self.data = self.DataService.get(undefined, fitInterval, filterer, self.groupingOption.key)

  self.calcFormula() 

  self.datum = self.data[self.item.id]
  self.mean = self.comparisons.average ? self.mean(self.datum) : undefined
  //TODO previous should be calculated on selected item change unless comparison wouldn't show up in table
  //Comparisons
  //TODO PREVIOUS
  //if (self.comparisons.previous) self.getPrevious(data, valuer, grouper)
  self.$rootScope.$broadcast('selection-change', self.dateFormatter, self.keyParser)
}

Self.prototype.calcFormula = function () {
  var self = this

  self.DataService.items.forEach(function (item) {
    if (item.formula) {
      var itemData = self.data[item.id]
      , i = {}
      for (var k = 0; k < itemData.length; k++) {
        _.map(self.data, function (groupedArray, key) {
          i[key] = groupedArray[k].values.grouped.value
        })
        itemData[k].values.grouped.value = eval(item.formula)
      };
        
    }
  })
}

module.exports = Self
