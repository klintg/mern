var React = require('react')
var ReactDOM = require('react-dom')
var Router = require('react-router').Router
var Route = require('react-router').Route
var Redirect = require('react-router').Redirect

//dealing with the app history.
var routerHistory = require('react-router').useRouterHistory
var createHashHistory = require('history/lib/createHashHistory')

var BugList = require('./BugList')
var BugEdit = require('./BugEdit')

var NotFoundRoute = React.createClass({
  render: function() {
    return (
      <h2>Route Not Found </h2>
    )
  }
})

var appHistory = routerHistory(createHashHistory)({queryKey: false})

ReactDOM.render(
  (
    <Router history={appHistory}>
      <Route path='/bugs' component={BugList} />
      <Route path='/bugs/:id' component={BugEdit} />
      <Redirect from="/" to="/bugs" />
      <Route path="*" component={NotFoundRoute} />
    </Router>
  ),
  document.getElementById('main')
);
