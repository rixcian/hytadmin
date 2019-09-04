import React from 'react';
import moment from 'moment';
import {Icon, Popconfirm} from "antd";
import {Link} from "react-router-dom";

export default (props) => {
  const { data, headItems, isFetching, noDataMessage } = props;

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
                    //let updatedAt = !row.updatedAt ? 'Nikdy' : moment(row.updatedAt).format('DD.MM.YYYY');
                    return (
                      <tr key={i} className="text-center">
                        <td className="font-weight-medium pt-6">{row.username}</td>
                        <td className="pt-6">{row.email}</td>
                        <td className="pt-6 text-capitalize">{row.role}</td>
                        <td className="pt-6">{createdAt}</td>
                        <td className="pt-6">{row.active ? 'Ano' : 'Ne'}</td>
                        <td>
                          <Link to={`/editors/${row._id}`} className="btn btn-light mr-2">
                            <Icon type="info" style={{ position: 'relative', top: '-2px' }} /><span>&nbsp;Info</span>
                          </Link>
                          <Popconfirm
                            title="Opravdu chcete smazat tohoto redaktora?"
                            onConfirm={() => props.onEditorRemove(row._id)}
                            okText="Ano"
                            cancelText="Ne"
                            icon={<Icon type="delete" className={{ color: 'red !important' }} />}
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