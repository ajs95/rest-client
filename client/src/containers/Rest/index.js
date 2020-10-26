import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Query from "../../components/Query";
import Request from "../../components/Request";
import Response from "../../components/Response";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: theme.spacing(2),
  },
}));

const formatKeyValueToJson = (keyValue) => {
  let result = {};
  keyValue.forEach((item) => {
    if (item.key !== "") result[item.key] = item.value;
  });
  return result;
};

const Rest = (props) => {
  const classes = useStyles();
  const [method, setMethod] = React.useState("GET");
  const [endpoint, setEndpoint] = React.useState("");
  const [prevEndpoint, setPrevEndpoint] = React.useState("");
  const [request, setRequest] = React.useState({ params: [], headers: [] });
  const [response, setResponse] = React.useState({
    body: "",
    headers: "",
    loading: false,
  });

  const isInitialMountEndpoint = React.useRef(true);
  const isInitialMountParam = React.useRef(true);

  React.useEffect(() => {
    if (props.length === 0) {
      console.log("Props is empty");
    } else {
      console.log(`Props :`);
      console.log(props);
      try {
        const paramEndpoint = new URLSearchParams(props.location.search).get(
          "endpoint"
        );
        const paramHeaders = new URLSearchParams(props.location.search).get(
          "headers"
        );
        if (paramHeaders)
          setRequest((prevState) => ({
            ...prevState,
            headers: JSON.parse(paramHeaders),
          }));
        if (paramEndpoint) setEndpoint(paramEndpoint);
        console.log(endpoint);
      } catch (err) {
        console.log(`Error while parsing : ${err}`);
      }
    }
  }, []);

  const handleChangeMethod = (e) => {
    setMethod(e.target.value);
  };

  const handleChangeEndpoint = (e) => {
    console.log(`Endpoint = ${e.target.value}`);
    setEndpoint(e.target.value);
  };

  React.useEffect(() => {
    let currentUrlParams = new URLSearchParams(window.location.search);
    currentUrlParams.set("endpoint", endpoint);
    currentUrlParams.set("headers", JSON.stringify(request.headers));
    props.history.push(
      window.location.pathname + "?" + currentUrlParams.toString()
    );
  }, [endpoint, request.headers]);

  React.useEffect(() => {
    if (isInitialMountEndpoint.current) {
      isInitialMountEndpoint.current = false;
    } else {
      console.log("Effect : endpointEffect");
      try {
        let params = [];
        console.log(endpoint);
        let queryIndex = endpoint.indexOf("?");
        let queryIndexPrev = prevEndpoint.indexOf("?");
        console.log(queryIndex);
        console.log(queryIndexPrev);
        if (queryIndex < 0 && request.params.length > 0) {
          console.log("Effect : endpoint - params set to empty");
          setRequest((prevState) => ({
            ...prevState,
            params: [],
          }));
        }
        if (
          queryIndex >= 0 &&
          endpoint.substring(queryIndex) !==
            prevEndpoint.substring(queryIndexPrev) &&
          !(
            endpoint.length > prevEndpoint.length &&
            endpoint.startsWith(prevEndpoint) &&
            ["=", "&"].includes(endpoint.substring(prevEndpoint.length))
          )
        ) {
          let searchParams = new URLSearchParams(
            endpoint.substring(queryIndex)
          );
          let flagUpdateParams = false;
          searchParams.forEach((v, k) => {
            flagUpdateParams = true;
            params.push({ key: k, value: v });
          });

          if (flagUpdateParams) {
            console.log("Effect : endpoint - Updating params");
            setRequest((prevState) => ({
              ...prevState,
              params: params,
            }));
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
    setPrevEndpoint(endpoint);
  }, [endpoint]);

  React.useEffect(() => {
    if (isInitialMountParam.current) {
      isInitialMountParam.current = false;
    } else {
      console.log("Effect : param");
      try {
        let queryIndex = endpoint.indexOf("?");
        if (queryIndex >= 0) {
          let newEndpoint = endpoint.substring(0, queryIndex);
          console.log(newEndpoint);

          if (request.params.length > 0) {
            newEndpoint = newEndpoint + "?";
          }
          let count = 1;
          request.params.forEach((kv) => {
            if (kv.key !== "") {
              newEndpoint = newEndpoint + kv.key;
              if (kv.value !== "") {
                newEndpoint = newEndpoint + "=" + kv.value;
              }
              if (count < request.params.length) {
                newEndpoint = newEndpoint + "&";
              }
              count++;
            }
            if (
              count === request.params.length &&
              kv.key === "" &&
              newEndpoint.endsWith("&")
            ) {
              newEndpoint = newEndpoint.slice(0, -1);
            }
          });
          console.log("Effect : param - Updating Endpoint");
          setEndpoint(newEndpoint);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }, [request.params]);

  const handleChangeRequest = (e) => {
    if (["pkey", "pvalue"].includes(e.target.name)) {
      // console.log(request);
      let params = [...request.params];
      params[parseInt(e.target.id.substring(3))][e.target.name.substring(1)] =
        e.target.value;
      setRequest((prevState) => ({
        ...prevState,
        params: params,
      }));
    } else if (["hkey", "hvalue"].includes(e.target.name)) {
      // console.log(request);
      let headers = [...request.headers];
      headers[parseInt(e.target.id.substring(3))][e.target.name.substring(1)] =
        e.target.value;
      setRequest((prevState) => ({
        ...prevState,
        headers: headers,
      }));
    } else {
      console.log("new param element");
    }
  };

  const updateStateRequest = (val) => {
    if ("param" === val) {
      setRequest((prevState) => ({
        ...prevState,
        params: [...prevState.params, { key: "", value: "" }],
      }));
    } else if ("header" === val) {
      setRequest((prevState) => ({
        ...prevState,
        headers: [...prevState.headers, { key: "", value: "" }],
      }));
    }
  };

  const makeApiRequest = () => {
    try {
      setResponse({ loading: true });
      let url = new URL(endpoint);
      let apidata = {};
      apidata.method = method;
      apidata.url = endpoint; //url.protocol + "//" + url.host + url.pathname;
      apidata.headers = formatKeyValueToJson(request.headers);
      apidata.params = formatKeyValueToJson(request.params);

      console.log(url);
      console.log(apidata);

      axios
        .post("http://localhost:8000/api/proxy", apidata, {
          "Content-Type": "application/json",
          Accept: "application/json",
        })
        .then((res) => {
          console.log(res);
          setResponse({
            loading: false,
            status: res.status,
            body: JSON.stringify(res.data, null, 1),
            headers: JSON.stringify(res.headers, null, 1),
          });
        })
        .catch((error) => {
          console.log(error);

          //To be updated
          setResponse({
            loading: false,
            status: 500,
            body: "error",
            headers: "",
          });
        });
    } catch (err) {
      console.log(err);
      setResponse({
        loading: false,
        body: "URL is not properly formed", // JSON.stringify({ message: err }, null, 2),
        headers: "",
      });
    }
  };

  return (
    <Grid container className={classes.root} spacing={3}>
      <Grid item xs={12}>
        <Query
          method={method}
          endpoint={endpoint}
          handleChangeMethod={handleChangeMethod}
          handleChangeEndpoint={handleChangeEndpoint}
          makeApiRequest={makeApiRequest}
        />
      </Grid>
      <Grid item xs={5}>
        <Request
          request={request}
          updateStateRequest={updateStateRequest}
          handleChangeRequest={handleChangeRequest}
        />
      </Grid>
      <Grid item xs={7}>
        <Response response={response} />
      </Grid>
    </Grid>
  );
};

export default Rest;
