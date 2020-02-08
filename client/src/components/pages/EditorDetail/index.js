import React from "react";
import axios from "axios";
import moment from "moment";
import { Link } from "react-router-dom";
import { Icon, notification } from "antd";

import ArticleTable from "./ArticleTable";
import Pagination from "../../ui/Pagination";
import configMoment from "../../../moment-config.js";

import("./EditorDetail.scss");

configMoment(moment);

class EditorDetail extends React.Component {
  state = {
    allArticlesCount: 0,
    editor: {},
    isFetching: true,
    articlesSkip: 0,
    articlesLimit: 10,
    activePage: 1,
    numberOfPages: 1
  };

  fetchUser = editorID => {
    this.setState({ isFetching: true });

    axios.get(`/api/users/${editorID}`).then(res => {
      const { allArticlesCount, editor } = res.data;
      this.setState({
        allArticlesCount,
        editor,
        isFetching: false,
        numberOfPages: Math.ceil(allArticlesCount / this.state.articlesLimit)
      });
    });
  }

  componentDidMount = () => this.fetchUser(this.props.match.params.id);

  componentDidUpdate = prevProps => {
    if (prevProps.match.params.id !== this.props.match.params.id)
      this.fetchUser(this.props.match.params.id)
  }

  onPageChange = numOfPage => {
    let articlesSkip = (numOfPage - 1) * this.state.articlesLimit;
    let articlesLimit =
      this.state.allArticlesCount - articlesSkip > this.state.articlesLimit
        ? this.state.articlesLimit
        : this.state.allArticlesCount - articlesSkip;
    this.setState({
      articlesSkip,
      articlesLimit,
      activePage: numOfPage,
      numberOfPages: Math.ceil(
        this.state.allArticlesCount / this.state.articlesLimit
      )
    });
  };

  onArticleRemove = articleID => {
    axios
      .delete(`/api/articles/${articleID}`)
      .then(() => {
        notification["success"]({
          message: "Článek odstraněn",
          description: "Článek byl úspěšně odstraněn z databáze",
          placement: "bottomRight"
        });

        this.setState({ allArticlesCount: this.state.allArticlesCount - 1 });
        this.onPageChange(1);
      })
      .catch(err => {
        notification["error"]({
          message: "Článek se nepodařilo odstranit",
          description: err.response.data.err,
          placement: "bottomRight"
        });
      });
  };

  render() {
    const { username, createdAt, email, avatarPath } = this.state.editor;
    const editorSince = moment(createdAt).format('DD.MM.YYYY');
    let editorSinceInDays = moment().from(createdAt);

    if (this.state.isFetching) {
      return (
        <div className="text-center page-editor-loading">
          <Icon
            type="sync"
            spin
            style={{ padding: "40px", fontSize: "4rem" }}
          />
        </div>
      );
    } else {
      return (
        <>
          <div className="profile page-editor">
            <div className="profile__banner">
              <div className="profile__banner-top">
                <div className="dt-avatar-wrapper">
                  <picture>
                    <source srcSet={avatarPath} type="image/webp" />
                    <source srcSet={avatarPath} type="image/png" />
                    <img
                      className="dt-avatar dt-avatar__shadow size-90 mr-sm-4"
                      src={avatarPath}
                      alt={username}
                    />
                  </picture>

                  <div className="dt-avatar-info">
                    <span className="dt-avatar-name display-4 mb-2 font-weight-medium">
                      {username}
                    </span>
                    <span className="f-16 text-light">
                      Redaktorem od {editorSince}
                    </span>
                  </div>
                </div>

                <div className="ml-sm-auto">
                  <ul className="dt-list dt-list-bordered dt-list-one-third">
                    <li className="dt-list__item text-right">
                      <h4 className="font-weight-medium mb-0 text-white">{this.state.allArticlesCount}</h4>
                      <span className="d-inline-block f-12">článků celkem</span>
                    </li>

                    <li className="dt-list__item text-right">
                      <h4 className="font-weight-medium mb-0 text-white">{editorSinceInDays}</h4>
                      <span className="d-inline-block f-12">redaktorem</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="profile__banner-bottom">
                <div className="dropdown pl-3 mt-2 ml-auto">
                  <Link
                    to="/account/settings"
                    className="dropdown-toggle no-arrow text-white"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <i className="icon icon-setting icon-xl mr-2" />
                    <span className="d-none d-sm-inline-block">Nastavení</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="profile-content">
              <div className="row">
                <div className="col-xl-4 order-xl-2">
                  <div className="row">
                    <div className="col-xl-12 col-md-6 col-12 order-xl-1">
                      <div className="dt-card dt-card__full-height">
                        <div className="dt-card__header">
                          <div className="dt-card__heading">
                            <h3 className="dt-card__title">Kontakt</h3>
                          </div>
                        </div>

                        <div className="dt-card__body">
                          <div className="media">
                            <i className="icon icon-email icon-xl mr-5" />

                            <div className="media-body">
                              <span className="d-block text-light-gray f-12 mb-1">
                                Email
                              </span>
                              <p className="text-dark-blue">{email}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-8 order-xl-1">
                  <div className="card">
                    <div className="card-header card-nav bg-transparent d-flex justify-content-between">
                      <h2 style={{ marginBottom: "-10px" }}>
                        Přehled článků autora
                      </h2>
                    </div>

                    <div className="card-body pb-2 pt-0">
                      <ArticleTable
                        editorID={this.props.match.params.id}
                        articlesSkip={this.state.articlesSkip}
                        articlesLimit={this.state.articlesLimit}
                        noDataMessage="Autor ještě nenapsal žádný článek"
                        headItems={[
                          "Nadpis",
                          "Vytvořeno",
                          "Naposledy upraveno",
                          "Úpravy"
                        ]}
                        onArticleRemove={articleID =>
                          this.onArticleRemove(articleID)
                        }
                      />
                    </div>
                  </div>

                  {this.state.allArticlesCount !== 0 && (
                    <Pagination
                      numberOfPages={this.state.numberOfPages}
                      onPageChange={numOfPage => this.onPageChange(numOfPage)}
                      activePage={this.state.activePage}
                      className="mt-4"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }
  }
}

export default EditorDetail;
