import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  text: {
    width: "130ch",
  },
  method: {
    width: "8ch",
  },
}));

const Query = (props) => {
  const classes = useStyles();

  return (
    <div>
      <Grid container spacing={2}>
        <Select
          className={classes.method}
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={props.method}
          onChange={props.handleChangeMethod}
          label="Age"
        >
          <MenuItem value={"GET"}>GET</MenuItem>
          <MenuItem value={"POST"}>POST</MenuItem>
        </Select>
        <TextField
          id="outlined-basic"
          className={classes.text}
          label="Endpoint"
          variant="outlined"
          value={props.endpoint}
          onChange={props.handleChangeEndpoint}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={props.makeApiRequest}
        >
          SEND
        </Button>
      </Grid>
    </div>
  );
};

export default Query;
