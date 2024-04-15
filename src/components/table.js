import React from 'react';
import { useTable } from 'react-table';
import roster from '../generate/roster.json';

function Table() {
  const data = React.useMemo(() => roster, []);
  const columns = React.useMemo(
    () => [
      {
        Header: 'Month',
        accessor: 'Month',
      },
      {
        Header: 'Week',
        accessor: 'Week',
      },
      {
        Header: 'Date',
        accessor: 'Date',
      },
      {
        Header: 'AM',
        accessor: 'AM',
      },
      {
        Header: 'PM',
        accessor: 'PM',
      },
      {
        Header: 'Backup',
        accessor: 'Backup',
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  return (
    <table {...getTableProps()} style={{ width: '100%', margin: '0 auto', borderCollapse: 'collapse' }}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()} style={{ borderBottom: 'solid 3px #ddd', background: '#f3f3f3', color: '#333', fontWeight: 'bold', padding: '10px', textAlign: 'left' }}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => (
                <td {...cell.getCellProps()} style={{ padding: '10px', borderBottom: 'solid 1px #ddd' }}>{cell.render('Cell')}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default Table;