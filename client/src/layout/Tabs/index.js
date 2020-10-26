import * as React from "react";
import Box from "@material-ui/core/Box";

export const TabPanel = (props) => {
  const { children, value, index, tabId, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`${tabId}panel-${index}`}
      aria-labelledby={`${tabId}-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
};

// TabPanel.propTypes = {
//   children: PropTypes.node,
//   index: PropTypes.any.isRequired,
//   value: PropTypes.any.isRequired,
// };

export function tabAllyProps(index, tabId) {
  return {
    id: `${tabId}-${index}`,
    "aria-controls": `${tabId}panel-${index}`,
  };
}
