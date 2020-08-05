import React from 'react';
import {Table} from '../src';
import {TableProps} from 'antd/lib/table';

export default {
  title: 'Table',
};

const tableProps: TableProps<any> = {
  dataSource: [
    {
      id: 1,
      name: 'Sai',
      country: 'India',
    }, {
      id: 2,
      name: 'Vaddi',
      country: 'USA',
    },
  ],
  columns: [
    {
      dataIndex: 'name',
    },
    {
      dataIndex: 'country',
    },
  ],
  rowKey: 'id',
};

// By passing optional props to this story, you can control the props of the component when
// you consume the story in a test.
export const Default = (props: any) => <Table {...props} {...tableProps} />;
