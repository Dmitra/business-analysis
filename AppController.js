var Self = function ($rootScope, $scope, Path, DataProvider, DataService, TemporalService) {
  var self = this

  self.Path = Path
  self.DataProvider = DataProvider
  self.store = DataProvider.stores[0]
  self.DataProvider.load(self.store)


  //temporalModule API usage examples:

  //TODO test

  //TemporalService.
  //add new period: quarter
  //change intervalOption captions 'This period' to 'Current period'
  //localize date formatters
}

module.exports = Self
