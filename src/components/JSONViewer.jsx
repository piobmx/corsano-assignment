import ReactJson from "react-json-view";

const JSONViewer = (props) => (
  <ReactJson
    name={props.name}
    groupArraysAfterLength={props.groupLength}
    src={props.data}
    theme="summerfruit:inverted"
  />
);

export default JSONViewer;
