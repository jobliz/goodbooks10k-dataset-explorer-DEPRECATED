import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  menu: {
    width: 200,
  },
});

class SearchTextField extends React.Component {
  state = {
    name: ''
  };

  constructor(props) {
    super();
    this.props = props;
  }

  /*
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };*/

  render() {
    const { classes } = this.props;

    return (
      <form className={classes.container} noValidate autoComplete="off">
        <TextField
          id="full-width"
          label="Search"
          type="search"
          /*InputLabelProps={{
            shrink: true,
          }}*/
          placeholder="Enter terms in title"
          /* helperText="Full width!" */
          fullWidth
          margin="normal"
          value={this.props.title_search}
          onChange={this.props.onChange}
        />
      </form>
    );
  }
}

SearchTextField.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SearchTextField);
