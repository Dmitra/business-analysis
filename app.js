var Path = {
  root: ''
, ta: 'node_modules/TemporalAnalysis/src/'
, angularStrap: 'node_modules/angular-strap/'
}
require('./DataProvider')
var temporalAnalysis = require('TemporalAnalysis')

var app = angular.module('ba', [
  'mgcrea.ngStrap'
, 'dataProvider'
, 'temporalAnalysis'
])
app.value('Path', Path)

temporalAnalysis.value('ta.Path', {
  root: Path.ta
, angularStrap: Path.angularStrap
})
app.controller('AppController', [
  '$rootScope'
, '$scope'
, 'Path'
, 'DataProvider'
, require('./AppController')
])

app.controller('TemporalController', [
  '$rootScope'
, '$scope'
, 'Path'
, 'DataService'
, 'TemporalService'
, require('./TemporalController')
])
