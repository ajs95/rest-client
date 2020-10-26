import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import CircularProgress from "@material-ui/core/CircularProgress";
import { TabPanel, tabAllyProps } from "../../layout/Tabs";

const respTabId = "resp-scrollable-auto-tab";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  loading: {
    padding: "200px 300px",
    display: "flex",
    "& > * + *": {
      marginLeft: theme.spacing(3),
    },
  },
  status: {
    padding: "10px 220px",
  },
}));

const Response = (props) => {
  const classes = useStyles();
  const { response } = props;
  const [value, setValue] = React.useState(0);

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  let responseBody = "";
  let responseStatus = <div></div>;

  if (response.loading) {
    responseBody = (
      <div className={classes.loading}>
        <CircularProgress />
      </div>
    );
  } else {
    console.log(response);
    if (response.status)
      responseStatus = (
        <span className={classes.status}>{`Status : ${response.status}`}</span>
      );
    responseBody = (
      <div>
        <pre>{response.body}</pre>
      </div>
    );
  }
  return (
    <div className={classes.root}>
      Response
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
          <Tab label="Body" {...tabAllyProps(0, respTabId)} />
          <Tab label="Headers" {...tabAllyProps(1, respTabId)} />
          {responseStatus}
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0} tabId={respTabId}>
        {responseBody}
      </TabPanel>
      <TabPanel value={value} index={1} tabId={respTabId}>
        <div>
          <pre>{response.headers}</pre>
        </div>
      </TabPanel>
    </div>
  );
};

export default Response;
