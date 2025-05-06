import React from 'react';
import './styles.scss';

const Table = ({ columns, data, renderRow, actions }) => (
  <table className={'user-table'}>
    <thead>
      <tr>
        {columns.map((col, index) => (
          <th
            key={index}
            onClick={() => col.sortable && col.onSort()}
            className={col.sortable ? 'sortable-header' : ''}
          >
            {col.label}
            {col.sortable && col.isSorted && (col.isAscending ? ' ▲' : ' ▼')}
          </th>
        ))}
        {actions && <th>Actions</th>}
      </tr>
    </thead>
    <tbody>
      {data.map((row, index) => (
        <tr key={row.UserID}>
          {renderRow(row, index)}
          {actions && (
            <td>
              {actions.map((action, index) => (
                <button
                  key={index}
                  className={action.className}
                  onClick={() => action.onClick(row)}
                >
                  {action.label}
                </button>
              ))}
            </td>
          )}
        </tr>
      ))}
    </tbody>
  </table>
);

export default Table;
