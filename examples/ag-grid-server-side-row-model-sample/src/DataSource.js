import { data } from "./data";

const newData = data();
export class DataSource {
  gridOptions;
  client;
  currentGuideId;

  constructor(gridOptions) {
    this.gridOptions = gridOptions;
  }

  getRows = async params => {
    const { data } = params.parentNode;
    console.log("data is -- ", data);
    if (!data) {
      setTimeout(() => {
        params.successCallback(newData, newData.length);
      }, 1000);
    } else {
      setTimeout(() => {
        const { children } = data;
        params.successCallback(children, children.length);
      }, 1000);
    }
  };
}
