var React = require('react')
var ReactDOM = require('react-dom')

var BugAdd = React.createClass({
  handleSubmit(e) {
    e.preventDefault();

    var form = document.forms.bugAdd
    this.props.addBug({owner: form.owner.value, title: form.title.value, status:'New', priority:'P1'});
    //clearing the form for the next input
    form.owner.value ="";
    form.title.value = "";
  },

  render: function() {
    //console.log("Rendering BugAdd")
    return (
      <form name="bugAdd">
        <input type="text" name="owner" placeholder="Owner" />
        <input type="text" name="title" placeholder="Title" />
        <button onClick={this.handleSubmit}>Add Bug</button>
      </form>
    )
  }
});

module.exports = BugAdd;
