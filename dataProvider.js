var Self = function ($rootScope, $q, $timeout) {
  var self = this
  self.name = 'DataProvider'
  self.$q = $q
  self.$rootScope = $rootScope
  self.$timeout = $timeout

  //TODO Convention variable - find better way for providing consumers with choosen store data
  self.loaded = {}

  d3.csv('data/items.csv', function (data) {
    self.parseItems(data)
  })
}

Self.prototype.stores = [{
    id: 'Tsunahachi'
  , name: 'Tsunahachi'
  }, {
    id: 'Kujiraya'
  , name: 'Kujiraya'
  }, {
    id: 'Microcosmos'
  , name: 'Microcosmos'
}]

Self.prototype.dateFormatter = d3.time.format('%m.%d.%y')

Self.prototype.load = function (store) {
  var self = this
  var deferred = self.$q.defer()
  if (!store.data) {
    d3.csv('data/' + store.id + '.csv', function (input) {
      var data = []

      //Parse csv
      //format input data
      for (var i = 0; i < input.length; i++) {
        data[i] = {}
        data[i].date = self.dateFormatter.parse(input[i].date)
        self.items.forEach(function (item) {
          data[i][item.id] = +input[i][item.id]
        })
      }

      store.data = data
      self.loaded = data
      self.$timeout(function () {
        self.$rootScope.$broadcast('data-loaded', data, self.items)
      }, 500)
      deferred.resolve(data)
    })
  } else {
    self.$rootScope.$broadcast('data-loaded', store.data, self.items)
    deferred.resolve(store.data)
  }

  return deferred.promise
}

Self.prototype.parseItems = function (data) {
  var self = this
  self.items = data
}

module.exports = angular.module('dataProvider', [])
  .service('DataProvider', ['$rootScope', '$q', '$timeout', Self])
