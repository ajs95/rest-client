import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { TabPanel, tabAllyProps } from "../../layout/Tabs";
import { Button, TextField } from "@material-ui/core";

const reqTabId = "req-scrollable-auto-tab";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  form: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));

const Request = (props) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      Request
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChangeTab}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          <Tab label="Params" {...tabAllyProps(0, reqTabId)} />
          <Tab label="Headers" {...tabAllyProps(1, reqTabId)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0} tabId={reqTabId}>
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => props.updateStateRequest("param")}
          >
            Add Param
          </Button>
          <form className={classes.form} onChange={props.handleChangeRequest}>
            {props.request.params.map((item, idx) => {
              let paramKeyId = `pK-${idx}`,
                paramValueId = `pV-${idx}`;
              return (
                <div key={`${paramKeyId}-${paramValueId}`}>
                  <TextField
                    required
                    id={paramKeyId}
                    label="Key"
                    name="pkey"
                    value={item.key}
                  />
                  <TextField
                    required
                    id={paramValueId}
                    label="Value"
                    name="pvalue"
                    value={item.value}
                  />
                </div>
              );
            })}
          </form>
        </div>
      </TabPanel>
      <TabPanel value={value} index={1} tabId={reqTabId}>
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => props.updateStateRequest("header")}
          >
            Add Header
          </Button>
          <form className={classes.form} onChange={props.handleChangeRequest}>
            {props.request.headers.map((item, idx) => {
              let headerKeyId = `hK-${idx}`,
                headerValueId = `hV-${idx}`;
              return (
                <div key={`${headerKeyId}-${headerValueId}`}>
                  <TextField
                    required
                    id={headerKeyId}
                    label="Key"
                    name="hkey"
                    value={item.key}
                  />
                  <TextField
                    required
                    id={headerValueId}
                    label="Value"
                    name="hvalue"
                    value={item.value}
                  />
                </div>
              );
            })}
          </form>
        </div>
      </TabPanel>
    </div>
  );
};

export default Request;
