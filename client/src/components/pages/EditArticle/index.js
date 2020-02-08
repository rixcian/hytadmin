import React from 'react';
import axios from 'axios';
import { notification, Icon } from 'antd';

import UploadThumbnails from "../../ui/UploadThumbnails";
import ArticleContentWrapper from '../../ui/ArticleContentWrapper';

class EditArticle extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      articleContent: [],
      thumbnailImagePath: '',
      coverImagePath: '',
      showAddOptions: false,
      isFetching: true,
    }
  }

  setImageThumbnailPath = path => this.setState({ thumbnailImagePath: path });

  setImageCoverPath = path => this.setState({ coverImagePath: path });

  componentDidMount() {
    axios.get(`/api/articles/${this.props.match.params.id}`)
    .then(res => {
      const { title, content, thumbnailImagePath, coverImagePath, draft } = res.data;
      this.setState({ title, articleContent: content, thumbnailImagePath, coverImagePath, isFetching: false, draft });
    })
    .catch(() => {
      notification['error']({
        message: 'Článek se nepodařilo načíst',
        description: 'Nastala chyba s načtením článku',
        placement: 'bottomRight'
      });
      this.props.history.push('/articles');
    });
  }

  saveArticle = (isArticleDraft) => {
    const data = { ...this.state, draft: isArticleDraft };
    axios.put(`/api/articles/${this.props.match.params.id}`, data)
      .then(() => {
        notification['success']({
          message: 'Článek byl úspěšně upraven',
          description: 'Váš článek byl úspěšně upraven a nahrán do databáze.',
          placement: 'bottomRight'
        });
        this.props.history.push('/articles');
      })
      .catch(() => {
        notification['error']({
          message: 'Článek se nepodařilo nahrát',
          description: 'Nastala chyba s načtením článku',
          placement: 'bottomRight'
        });
      })
  };

  itemChanged = (item, index) => {
    let newContentList = this.state.contentList;
    newContentList[index] = item;
    this.setState({ contentList: newContentList });
  }

  addArticleItem = (type, content) => {
    let item = {
      id: Math.random().toString(36).substring(8),
      type: type,
      content: content,
      visible: false
    };

    let newArticleContent = this.state.articleContent;
    newArticleContent.push(item);
    this.setState({ articleContent: newArticleContent });
  }

  deleteArticleItem = itemToDelete => {
    let newArticleContent = this.state.articleContent;
    let itemIndex = newArticleContent.findIndex(item => item.id === itemToDelete.id);
    
    newArticleContent.splice(itemIndex, 1);
    this.setState({ articleContent: newArticleContent });
  }

  render() {
    const { isFetching } = this.state;

    return (
      <>
        <div className="dt-page__header">
          <h1 className="dt-page__title">
            Editace článku {this.state.draft && <small><i>Koncept</i></small>}
          </h1>
        </div>

        {isFetching ? (
          <div className="dt-card">
            <div className="dt-card__body text-center">
              <Icon type="sync" spin style={{ padding: '40px', fontSize: '3rem' }}/>
            </div>
          </div>
        ) : (

          <div className="dt-card">
            <div className="dt-card__body">
              <div className="form-group">
                <label htmlFor="email-1">Nadpis</label>
                <input
                  type="email"
                  className="form-control"
                  value={this.state.title}
                  onChange={(e) => this.setState({ title: e.target.value })}
                  placeholder="Vložte nadpis"
                  autoComplete="off"
                  autoFocus />
              </div>

              <div className="form-group">
                <label className="mb-5">Náhledové obrázky</label>
                <UploadThumbnails
                  setImageThumbnailPath={path => this.setImageThumbnailPath(path)}
                  setImageCoverPath={path => this.setImageCoverPath(path)}
                  imageThumbnailPath={this.state.thumbnailImagePath}
                  imageCoverPath={this.state.coverImagePath}
                  articleID={this.props.match.params.id}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email-1">Obsah</label>
                <ArticleContentWrapper 
                  initialContent={this.state.articleContent} 
                  onContentUpdate={updatedArticleContent => this.setState({ articleContent: updatedArticleContent })}
                  onDeleteItem={item => this.deleteArticleItem(item)}
                />
              </div>

              <div className="form-group mt-10" style={{ textAlign: 'right' }}>
              <div className="add-article-content mb-2 float-left">
                <button
                  type="button"
                  className="btn btn-dark ml-2"
                  onClick={() => { 
                    if (this.state.showAddOptions) {
                      this.setState({ showAddOptions: false });
                    }
                    else {
                      this.setState({ showAddOptions: true });
                    }
                   }}
                >
                  {this.state.showAddOptions ? "-" : "+"}
                </button>

                <div ref={this.addItemsRef} className="add-article-items">
                  <div 
                    className={this.state.showAddOptions ? "add-article-item fadeIn delay0" : "add-article-item fadeOut delay30"}
                    onClick={() => this.addArticleItem('heading', '')}
                    >Nadpis</div>
                  <div 
                    className={this.state.showAddOptions ? "add-article-item fadeIn delay0" : "add-article-item fadeOut delay30"}
                    onClick={() => this.addArticleItem('text', '')}
                    >Text</div>
                  <div 
                    className={this.state.showAddOptions ? "add-article-item fadeIn delay15" : "add-article-item fadeOut delay15"}
                    onClick={() => this.addArticleItem('image', '')}
                    >Obrázek</div>
                  <div 
                    className={this.state.showAddOptions ? "add-article-item fadeIn delay30" : "add-article-item fadeOut delay0"}
                    onClick={() => this.addArticleItem('video', '')}
                    >Video</div>
                </div>
                
              </div>
                <button
                  type="button"
                  className="btn btn-light mr-2 mb-2"
                  onClick={() => this.saveArticle(true)}
                >Uložit jako koncept</button>
                <button
                  type="button"
                  className="btn btn-dark mr-2 mb-2"
                  onClick={() => this.saveArticle(false)}
                >Uložit</button>
              </div>

            </div>
          </div>

        )}
      </>
    );
  }
}

export default EditArticle;