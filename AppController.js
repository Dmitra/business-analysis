var Self = function ($rootScope, $scope, Path, DataProvider, DataService, TemporalService) {
  var self = this

  self.Path = Path
  self.DataProvider = DataProvider
  self.store = DataProvider.stores[0]
  self.DataProvider.load(self.store)
}

module.exports = Self
