var React = require('react')
var ReactDOM = require('react-dom')
var $ = require('jquery')
var Link = require('react-router').Link;

var BugFilter = require('./BugFilter')
var BugAdd = require('./BugAdd')

var BugRow = React.createClass({
  render: function() {
    //console.log('Rendering BugRow', this.props.bug)
    return (
      <tr>
        <td>
          <Link to={'/bugs/' + this.props.bug._id}>{this.props.bug._id}</Link>
        </td>
        <td>{this.props.bug.status}</td>
        <td>{this.props.bug.priority}</td>
        <td>{this.props.bug.owner}</td>
        <td>{this.props.bug.title}</td>
      </tr>
    )
  }
});

var BugTable = React.createClass({
  render: function() {
    //console.log('Rendering bug table, num of items', this.props.bugs.length)
    var bugRows = this.props.bugs.map(function(bug) {
      return <BugRow key={bug._id} bug={bug} />
    });
    return (
      <table className="table table-striped table-bordered table-condensed">
        <thead>
          <tr>
            <th>id</th>
            <th>status</th>
            <th>Priority</th>
            <th>Owner</th>
            <th>Title</th>
          </tr>
        </thead>
        <tbody>
          {bugRows}
        </tbody>
      </table>
    )
  }
});




var BugList = React.createClass({
  getInitialState () {
    return {bugs: []}
  },

  componentDidMount() {
    console.log("BugList: componentDidMount")
    this.loadData()
  },

  componentDidUpdate(prevProps) {
    var oldQuery = prevProps.location.query
    var newQuery = this.props.location.query
    if (oldQuery.priority === newQuery.priority && oldQuery.status === newQuery.status) {
      console.log("Buglist: componentDidUpdate, no change in filter, not updating")
      return;
    } else {
      console.log("Buglist:componentDidUpdate, loading data with new filter")
      this.loadData()
    }
  },

  loadData: function() {
    var query = this.props.location.query || {};
    var filter = {priority:query.priority, status: query.status}

    $.ajax('/api/bugs', {data:filter}).done(function(data) {
      this.setState({bugs:data});
    }.bind(this))  //in production we'd also handle errors.
  },

  addBug(bug) {
    console.log('Adding bug:', bug);
    $.ajax({
      type: 'POST',
      url: '/api/bugs',
      contentType: 'application/json',
      data: JSON.stringify(bug),
      success:function(data) {
        var bug = data;
        //since we are advised not to modify the state, since it is immutable, we make a copy
        var bugsModified = this.state.bugs.concat(bug);
        this.setState({bugs: bugsModified})
      }.bind(this),
      error: function(xhr, status, err) {
        console.log("error adding bug:", err) //if there is an error we need to show it to the user.
      }
    })
  },

  changeFilter: function(newFilter) {
    this.props.history.push({search: '?' + $.param(newFilter)})

  },

  render: function() {
    console.log("Rendering buglist, num items:", this.state.bugs.length);
    return (
      <div>
        <h1>Bug Tracking</h1>
        <hr />
        
        <BugFilter submitHandler={this.changeFilter} initFilter={this.props.location.query}/>
        <hr />
        <BugTable bugs={this.state.bugs}/>
        <hr />
        <BugAdd addBug={this.addBug}/>

      </div>
    )
  }
});



module.exports = BugList
