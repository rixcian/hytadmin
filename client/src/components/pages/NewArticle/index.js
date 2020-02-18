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
      articleContent: [],
      thumbnailImagePath: '',
      coverImagePath: '',
      showAddOptions: false,
    }
    this.newArticleItemButtons = React.createRef();
  }

  componentDidMount() {
    this.newArticleItemButtons.current.style.display = 'none';
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
        description: err.response.data || '',
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

  toggleAddArticleItemOptions = () => {
    if (this.state.showAddOptions) {
      this.setState({ showAddOptions: false });
      setTimeout(() => {
        this.newArticleItemButtons.current.style.display = 'none';
      }, 450);
    }
    else {
      this.newArticleItemButtons.current.style.display = '';
      this.setState({ showAddOptions: true });
    }
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
                type="text"
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
                  onClick={this.toggleAddArticleItemOptions}
                >
                  {this.state.showAddOptions ? "-" : "+"}
                </button>

                <div ref={this.newArticleItemButtons} className="add-article-items">
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