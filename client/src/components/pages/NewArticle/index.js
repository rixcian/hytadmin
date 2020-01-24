import React from 'react';
import axios from 'axios';
import { notification } from 'antd';
import { ReactSortable } from 'react-sortablejs';

import ArticleContentHolder from '../../ui/ArticleContentHolder';

import UploadThumbnails from '../../ui/UploadThumbnails';
import './NewArticle.scss';
import '../../animations.scss';

class NewArticle extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      contentList: [
        // {
        //   id: '0',
        //   type: 'text',
        //   content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque turpis orci, tempus in fermentum nec, accumsan ut elit. Praesent consequat iaculis nunc, sit amet finibus ante scelerisque quis. Duis non ligula vel risus sagittis venenatis nec vitae dui. Proin laoreet nec quam sed pulvinar.',
        //   visible: false
        // },
        // {
        //   id: '1',
        //   type: 'video',
        //   content: '',
        //   visible: false
        // },
        // {
        //   id: '2',
        //   type: 'text',
        //   content: 'Integer quis augue at lectus pulvinar iaculis. Aliquam diam tellus, pulvinar vel diam et, tincidunt rutrum magna. Integer egestas feugiat justo, ut tincidunt magna sollicitudin sed. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        //   visible: false
        // },
        // {
        //   id: '3',
        //   type: 'image',
        //   content: '',
        //   visible: false
        // },
        // {
        //   id: '4',
        //   type: 'text',
        //   content: 'Curabitur quam elit, lacinia sed sapien sit amet, finibus tincidunt risus. Duis cursus tristique mollis. Proin vitae tristique velit. Aliquam erat volutpat. Vestibulum semper quam et metus sodales, eu pellentesque lorem viverra. Morbi nec purus magna.',
        //   visible: false
        // },
      ],
      thumbnailImagePath: '',
      coverImagePath: '',
      showAddOptions: false
    }
    this.addItemsRef = React.createRef();
  }

  setImageThumbnailPath = path => this.setState({ thumbnailImagePath: path });

  setImageCoverPath = path => this.setState({ coverImagePath: path });

  saveArticle = () => {
    axios.post('/api/articles', this.state)
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
      id: this.state.contentList.length + 1,
      type: type,
      content: content,
      visible: false
    };

    let newContentList = this.state.contentList;
    newContentList.push(item);
    this.setState({ contentList: newContentList });
  }

  updateArticleItem = (newItem) => {
    let newContentList = this.state.contentList;
    let oldItemIndex = newContentList.findIndex(item => item.id === newItem.id);
    newContentList[oldItemIndex] = newItem;
    this.setState({ contentList: newContentList });
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
              <ReactSortable 
                list={this.state.contentList} 
                setList={newList => this.setState({ contentList: newList})}
              >
                {this.state.contentList.map((item, i) => 
                  <ArticleContentHolder 
                    key={item.id}
                    item={item} 
                    onItemChange={item => this.updateArticleItem(item)} 
                  />
                )}
              </ReactSortable>
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
                    onClick={() => this.addArticleItem('text', '')}
                    >Text</div>
                  <div className={this.state.showAddOptions ? "add-article-item fadeIn delay15" : "add-article-item fadeOut delay15"}>Obrázek</div>
                  <div className={this.state.showAddOptions ? "add-article-item fadeIn delay30" : "add-article-item fadeOut delay0"}>Video</div>
                </div>
                
              </div>

              <button
                type="button"
                className="btn btn-light mr-2 mb-2"
              >Uložit jako koncept</button>
              
              <button
                type="button"
                className="btn btn-dark mr-2 mb-2"
                onClick={() => this.saveArticle()}
              >Uložit</button>
            </div>

          </div>
        </div>
      </>
    );
  }
}

export default NewArticle;