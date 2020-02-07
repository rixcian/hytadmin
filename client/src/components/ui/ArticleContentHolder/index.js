import React, { useState, useRef } from 'react';
import axios from 'axios';
import { notification } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import UploadArticleImage from '../UploadArticleImage';
import UploadArticleVideo from '../UploadArticleVideo';

const ArticleContentHolder = props => {

  const [item, setItem] = useState(props.item);
  const [content, setContent] = useState(props.item.content);
  const [visibility, setVisibility] = useState(item.visibility);

  const deleteButton = useRef();

  const itemContentChanged = newContent => {
    setContent(newContent);
    let newItem = item;
    newItem.content = newContent;
    newItem.visible = visibility;
    setItem(newItem);
    props.onItemChange(item);
  }

  const changeItemVisibility = () => {
    let updatedItem = item;
    updatedItem.visible = !visibility;
    setVisibility(!visibility);
    setItem(updatedItem);
    props.onItemChange(updatedItem); 
  }

  const handleOnClickEvent = e => {
    e.target === deleteButton.current 
      ? (item.type !== 'image' || item.type !== 'video') && props.onDeleteItem(item)
      : changeItemVisibility();
  }

  const deleteImage = () => {
    axios.post('/api/upload/image/delete', {imagePathToDelete: content})
      .then(() => {
        props.onDeleteItem(item);
        notification['success']({
          message: 'Obrázek se podařilo smazat',
          description: 'Obrázek byl úspěšně smazán ze serveru.',
          placement: 'bottomRight'
        });
      })
      .catch(err => {
        notification['error']({
          message: 'Obrázek se nepodařilo odstranit',
          description: err.response.data.err.toString(),
          placement: 'bottomRight'
        });
      })
  }

  const deleteVideo = () => {
    axios.post('/api/upload/video/delete', {videoPathToDelete: content})
      .then(() => {
        props.onDeleteItem(item);
        notification['success']({
          message: 'Video se podařilo smazat',
          description: 'Video bylo úspěšně smazáno ze serveru.',
          placement: 'bottomRight'
        });
      })
      .catch(err => {
        notification['error']({
          message: 'Video se nepodařilo odstranit',
          description: err.response.data.err.toString(),
          placement: 'bottomRight'
        });
      })
  }

  if (item.type === 'heading') {
    return (
      <div className="dt-card article-content article-text-content">

        <div 
          className="article-content-top" 
          onClick={e => handleOnClickEvent(e)}
        >
          <span>
            <FontAwesomeIcon icon="heading" className="content-icon mr-5 icon-fw" />
            &nbsp;{content.substring(0, 50)}... 
            <span>&nbsp;(Nadpis)</span>
          </span>
          <div className="ml-auto">
            <button ref={deleteButton} className="btn btn-sm btn-light mr-4">Odstranit</button>
            <i className={`icon ${item.visible ? `icon-menu-up` : `icon-menu-down`} icon-fw mr-2 mr-sm-1`}/>
          </div>
        </div>

        {visibility && 
          <div className="article-content-bottom">
            <hr />
            <input 
              className="form-control"
              type="text" 
              value={content}
              onChange={(e) => itemContentChanged(e.target.value)}
            />
          </div>
        }

      </div>  
    )
  }

  else if (item.type === 'text') {
    return (
      <div className="dt-card article-content article-text-content">

        <div 
          className="article-content-top" 
          onClick={e => handleOnClickEvent(e)}
        >
          <span>
            <FontAwesomeIcon icon="quote-right" className="content-icon mr-5 icon-fw" />
            &nbsp;{content.substring(0, 50)}... 
            <span>&nbsp;(Text)</span>
          </span>
          <div className="ml-auto">
            <button ref={deleteButton} className="btn btn-sm btn-light mr-4">Odstranit</button>
            <i className={`icon ${item.visible ? `icon-menu-up` : `icon-menu-down`} icon-fw mr-2 mr-sm-1`}/>
          </div>
        </div>

        {visibility && 
          <div className="article-content-bottom">
            <hr />
            <textarea 
              className="form-control" 
              value={content}
              onChange={(e) => itemContentChanged(e.target.value)}
            ></textarea>
          </div>
        }

      </div>  
    )
  }

  else if (item.type === 'image') {
    return (
      <div className="dt-card article-content article-image-content">

        <div 
          className="article-content-top" 
          onClick={e => handleOnClickEvent(e)}
        >
          <span>
            <FontAwesomeIcon icon="image" className="content-icon mr-5 icon-fw" />
            ... 
            <span>&nbsp;(Obrázek)</span>
          </span>
          <div className="ml-auto">
            <button ref={deleteButton} onClick={deleteImage} className="btn btn-sm btn-light mr-4">Odstranit</button>
            <i className={`icon ${item.visible ? `icon-menu-up` : `icon-menu-down`} icon-fw mr-2 mr-sm-1`}/>
          </div>
        </div>

        {visibility && 
          <div className="article-content-bottom">
            <hr />
            <UploadArticleImage 
              onChange={imagePath => itemContentChanged(imagePath)}
              oldImagePath={content}
            />
          </div>
        }

      </div>
    )
  }

  else if (item.type === 'video') {
    return (
      <div className="dt-card article-content article-video-content">

        <div 
          className="article-content-top" 
          onClick={e => handleOnClickEvent(e)}
        >
          <span>
            <FontAwesomeIcon icon="video" className="content-icon mr-5 icon-fw" />
            ... 
            <span>&nbsp;(Video)</span>
          </span>
          <div className="ml-auto">
            <button ref={deleteButton} onClick={deleteVideo} className="btn btn-sm btn-light mr-4">Odstranit</button>
            <i className={`icon ${item.visible ? `icon-menu-up` : `icon-menu-down`} icon-fw mr-2 mr-sm-1`}/>
          </div>
        </div>

        {visibility && 
          <div className="article-content-bottom">
            <hr />
            <UploadArticleVideo
              onChange={videoPath => itemContentChanged(videoPath)}
              oldVideoPath={content}
            />
          </div>
        }

      </div>
    )
  }

  else {
    return null;
  }
}

export default ArticleContentHolder;