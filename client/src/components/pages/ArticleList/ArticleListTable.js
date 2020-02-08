import React from 'react';
import { Icon, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';

import('./Table.scss');

export default (props) => {
  const { headItems, data, noDataMessage, isFetching } = props;

  if (isFetching) {
    return (
      <div className="dt-card overflow-hidden">
        <div className="dt-card__body p-0">
          <div className="table-responsive text-center">
            <Icon type="sync" spin style={{ padding: '40px', fontSize: '3rem' }}/>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className="dt-card overflow-hidden">
        <div className="dt-card__body p-0">
          <div className="table-responsive">

            {data.length > 0 ? (
                <table className="table cp-table table-hover mb-0">
                  <thead>
                  <tr>
                    {headItems.map((item, i) => (
                      <th key={i} className="text-uppercase text-center" scope="col">{item}</th>
                    ))}
                  </tr>
                  </thead>
                  <tbody>
                  {data.reverse().map((row, i) => {
                    let createdAt = moment(row.createdAt).format('DD.MM.YYYY');
                    let updatedAt = !row.updatedAt ? 'Nikdy' : moment(row.updatedAt).format('DD.MM.YYYY');
                    let draft = row.draft ? 'Ano' : 'Ne';
                    return (
                      <tr key={i} className="text-center">
                        <td className="font-weight-medium pt-6">{row.title}</td>
                        <td className="pt-6"><Link to={`/editors/${row.author._id}`} className="font-weight-medium author-link">{row.author.username}</Link></td>
                        <td className="pt-6">{createdAt}</td>
                        <td className="pt-6">{updatedAt}</td>
                        <td className="pt-6">{draft}</td>
                        <td>
                          <Link to={`/articles/${row._id}`} className="btn btn-light mr-2">
                            <Icon type="edit" style={{ position: 'relative', top: '-2px' }} /><span>&nbsp;Editovat</span>
                          </Link>
                          <Popconfirm
                            title="Opravdu chcete smazat tento článek?"
                            onConfirm={() => props.onArticleRemove(row._id)}
                            okText="Ano"
                            okButtonProps={{ type: 'danger' }}
                            cancelButtonProps={{ type: 'link', style: { color: 'rgba(0, 0, 0, 0.65)' } }}
                            cancelText="Ne"
                            icon={<Icon type="delete" style={{ color: 'red' }} />}
                            className="btn btn-danger mr-2">
                            <Icon type="delete" style={{ position: 'relative', top: '-2px' }} /><span>&nbsp;Smazat</span>
                          </Popconfirm>
                        </td>
                      </tr>
                    )}
                  )}
                  </tbody>
                </table>
              ) :
              <p className="text-center mt-5 mb-5">{noDataMessage}</p>
            }
          </div>
        </div>
      </div>
    )
  }
}