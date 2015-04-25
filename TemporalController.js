/**
 * Inherit from temporalModules controller
 */
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
  
  self.data = self.DataService.get(undefined, fitInterval, filterer, self.groupingOption.key)
  self.datum = self.addComparisons(self.data[self.item.id])
  self.calcFormula() 
  self.$rootScope.$broadcast('selection-change', self.dateFormatter, self.keyParser)
}

Self.prototype.calcFormula = function () {
  var self = this

  self.DataService.items.forEach(function (item) {
    if (item.formula) {
      var itemData = self.data[item.id]
      if (_.isEmpty(itemData)) return
      _.each(itemData[0].values.grouped, function (grouped, key) {
        var i = {}
        for (var k = 0; k < itemData.length; k++) {
          _.each(self.data, function (groupedArray, itemId) {
            i[itemId] = groupedArray[k].values.grouped[key]
          })
          itemData[k].values.grouped[key] = eval(item.formula)
        }
      })
    }
  })
}

module.exports = Self
