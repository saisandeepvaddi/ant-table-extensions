import React, { FC } from "react";
import { Table as AntTable } from "antd";


export const Table: FC<any> = props => {
  return <AntTable {...props} />;
};
