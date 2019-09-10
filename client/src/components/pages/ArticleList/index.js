import React from 'react';
import axios from 'axios';
import { notification } from "antd";

import ArticleListTable from './ArticleListTable';
import Pagination from '../../ui/Pagination';

class ArticleList extends React.Component {

  state = {
    allArticlesCount: 0,
    articles: [],
    isFetching: true,
    page: 1,
    paging: 10,
    activePage: 1,
    numberOfPages: 1
  };

  fetchArticles = (skip, limit) => {
    axios.get(`/api/articles/${skip}/${limit}`)
      .then(res => {
        const { allArticlesCount, articles } = res.data;
        this.setState({ allArticlesCount, articles,
          isFetching: false,
          numberOfPages: Math.ceil(allArticlesCount/this.state.paging)
        });
      })
      .catch(err => {
        notification['error']({
          message: 'Články se nepodařilo načíst',
          description: err.response.data,
          placement: 'bottomRight'
        });
      });
  };

  componentDidMount() {
    this.fetchArticles(0,10);
  }

  onArticleRemove = articleID => {
    axios.delete(`/api/articles/${articleID}`)
      .then(() => {
        notification['success']({
          message: 'Článek odstraněn',
          description: 'Článek byl úspěšně odstraněn z databáze',
          placement: 'bottomRight'
        });

        this.setState({ allArticlesCount: this.state.allArticlesCount - 1 });
        this.onPageChange(1);
      })
      .catch(err => {
        notification['error']({
          message: 'Článek se nepodařilo odstranit',
          description: err.response.data.err,
          placement: 'bottomRight'
        });
      });
  };

  onPageChange = numOfPage => {
    let skip = (numOfPage-1) * this.state.paging;
    let limit = (this.state.allArticlesCount-skip) > this.state.paging ? this.state.paging : (this.state.allArticlesCount-skip);
    this.setState({ isFetching: true });
    this.fetchArticles(skip, limit);
  };

  render() {
    const { articles, isFetching,
            allArticlesCount, paging,
            activePage, numberOfPages } = this.state;

    return (
      <>
        <div className="dt-page__header">
          <h1 className="dt-page__title">Přehled článků</h1>
        </div>

        <ArticleListTable
          headItems={['Nadpis', 'Autor', 'Vytvořeno', 'Naposledy upraveno', 'Úpravy']}
          data={articles}
          noDataMessage={'Ještě jste nepřidali žádný článek ...'}
          isFetching={isFetching}
          onArticleRemove={articleID => this.onArticleRemove(articleID)}
        />

        {allArticlesCount !== 0 &&
          <Pagination
            numberOfPages={numberOfPages}
            onPageChange={numOfPage => this.onPageChange(numOfPage)}
            activePage={activePage}
          />
        }

      </>
    );
  }
}

export default ArticleList;