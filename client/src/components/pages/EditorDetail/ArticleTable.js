import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Icon, notification, Popconfirm} from 'antd';
import moment from 'moment';
import {Link} from "react-router-dom";

export default (props) => {
  const { editorID, articlesSkip,
          articlesLimit, noDataMessage,
          headItems } = props;
  const [articles, setArticles] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  const fetchArticles = () => {
    axios.get(`/api/articles/${articlesSkip}/${articlesLimit}/author/${editorID}`)
    .then(res => {
      setArticles(res.data.articles);
      setIsFetching(false);
    })
    .catch(err => notification['error']({
      message: 'Nepodařilo se načíst články',
      description: err.response.data,
      placement: 'bottomRight'
    }));
  };

  useEffect(() => {
    !isFetching && setIsFetching(true);
    fetchArticles();
  }, []);

  if (isFetching) {
    return (
      <div className="table-responsive text-center">
        <Icon type="sync" spin style={{ padding: '40px', fontSize: '3rem' }}/>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      {articles.length > 0 ? (
          <table className="table cp-table table-hover mb-0">
            <thead>
            <tr>
              {headItems.map((item, i) => (
                <th key={i} className="text-uppercase text-center" scope="col">{item}</th>
              ))}
            </tr>
            </thead>
            <tbody>
            {
              articles.reverse().map((article, i) => {
                const createdAt = moment(article.createdAt).format('DD.MM.YYYY');
                const updatedAt = !article.updatedAt ? 'Nikdy' : moment(article.updatedAt).format('DD.MM.YYYY');

                return (
                  <tr key={i} className="text-center">
                    <td className="font-weight-medium pt-6">{article.title}</td>
                    <td className="pt-6">{createdAt}</td>
                    <td className="pt-6">{updatedAt}</td>
                    <td>
                      <Link to={`/articles/${article._id}`} className="btn btn-light mr-2">
                        <Icon type="edit" style={{ position: 'relative', top: '-2px' }} /><span>&nbsp;Editovat</span>
                      </Link>
                      <Popconfirm
                        title="Opravdu chcete smazat tento článek?"
                        onConfirm={() => props.onArticleRemove(article._id)}
                        okText="Ano"
                        cancelText="Ne"
                        icon={<Icon type="delete" className={{ color: 'red !important' }} />}
                        className="btn btn-danger mr-2">
                        <Icon type="delete" style={{ position: 'relative', top: '-2px' }} /><span>&nbsp;Smazat</span>
                      </Popconfirm>
                    </td>
                  </tr>
                )
              })
            }
            </tbody>
          </table>
      ) :
        <p className="text-center mt-5 mb-5">{noDataMessage}</p>
      }
    </div>
  )

};