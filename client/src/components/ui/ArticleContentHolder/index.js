import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import UploadArticleImage from '../UploadArticleImage';

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
      ? props.onDeleteItem(item)
      : changeItemVisibility();
  }

  if (item.type === 'text') {
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
            &nbsp;{content.substring(0, 50)}... 
            <span>&nbsp;(Obrázek)</span>
          </span>
          <div className="ml-auto">
            <button ref={deleteButton} className="btn btn-sm btn-light mr-4">Odstranit</button>
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
            &nbsp;{content.substring(0, 50)}... 
            <span>&nbsp;(Video)</span>
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

  else {
    return null;
  }
}

export default ArticleContentHolder;