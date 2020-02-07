import React from 'react';
import axios from 'axios';
import { notification } from 'antd';

import ArticleContentWrapper from '../../ui/ArticleContentWrapper';

import UploadThumbnails from '../../ui/UploadThumbnails';
import './NewArticle.scss';
import '../../animations.scss';

class NewArticle extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      indexer: 0,
      articleContent: [],
      thumbnailImagePath: '',
      coverImagePath: '',
      showAddOptions: false,
    }
    this.addItemsRef = React.createRef();
  }

  setImageThumbnailPath = path => this.setState({ thumbnailImagePath: path });

  setImageCoverPath = path => this.setState({ coverImagePath: path });

  saveArticle = (isArticleDraft) => {
    axios.post('/api/articles', {...this.state, draft: isArticleDraft})
    .then(() => {
      notification['success']({
        message: 'Článek byl úspěšně nahrán',
        description: 'Váš článek byl úspěšně nahrán do databáze a zveřejněn.',
        placement: 'bottomRight'
      });
      this.props.history.push('/articles');
    })
    .catch(err => {
      notification['error']({
        message: 'Článek se nepodařilo nahrát',
        description: err.response.data,
        placement: 'bottomRight'
      });
    })
  };

  itemChanged = (item, index) => {
    console.log('change');
    let newContentList = this.state.contentList;
    newContentList[index] = item;
    this.setState({ contentList: newContentList });
  }

  addArticleItem = (type, content) => {
    let item = {
      id: this.state.indexer++,
      type: type,
      content: content,
      visible: false
    };

    this.setState({ indexer: this.state.indexer });

    let newArticleContent = this.state.articleContent;
    newArticleContent.push(item);
    this.setState({ articleContent: newArticleContent });
  }

  deleteArticleItem = item => {
    const itemIndex = this.state.articleContent.indexOf(item);
    let newArticleContent = this.state.articleContent;
    newArticleContent.splice(itemIndex, 1);
    this.setState({ articleContent: newArticleContent });
  }

  render() {
    return (
      <>
        <div className="dt-page__header">
          <h1 className="dt-page__title">Nový článek</h1>
        </div>

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
              <label>Náhledové obrázky</label>
              <UploadThumbnails
                setImageThumbnailPath={path => this.setImageThumbnailPath(path)}
                setImageCoverPath={path => this.setImageCoverPath(path)}
              />
            </div>

            <div className="form-group">
              <label>Obsah článku</label>
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
                      //this.addItemsRef.current.style.opacity = 0;
                      this.setState({ showAddOptions: false });
                    }
                    else {
                      //this.addItemsRef.current.style.opacity = 1;
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
      </>
    );
  }
}

export default NewArticle;