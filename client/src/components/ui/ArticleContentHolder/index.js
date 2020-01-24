import React, { useState } from 'react';

const ArticleContentHolder = props => {

  const [item, setItem] = useState(props.item);
  const [content, setContent] = useState(props.item.content);
  const [visibility, setVisibility] = useState(item.visibility);

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

  if (item.type === 'text') {
    return (
      <div className="dt-card article-content article-text-content">

        <div className="article-content-top" onClick={() => changeItemVisibility()}>
          <span>
            <i className="icon icon-quote-backward icon-fw content-icon mr-5" />
            &nbsp;{content.substring(0, 50)}... 
            <span>&nbsp;(Text)</span>
          </span>
          <i className={`icon ${item.visible ? `icon-menu-up` : `icon-menu-down`} icon-fw mr-2 mr-sm-1`}/>
        </div>

        {visibility && 
          <div className="article-content-bottom">
            <hr />
            <textarea 
              className="form-control" 
              value={content}
              onChange={(e) => itemContentChanged(e.target.value)}
              onClick={() => {}}
            ></textarea>
          </div>
        }

      </div>  
    )
  }

  else if (item.type === 'image') {
    return (
      <div className="dt-card article-content article-image-content">

        <div className="article-content-top" onClick={() => setVisibility(!visibility)}>
          <span>
            <i className="icon icon-image icon-fw content-icon mr-5" />
            &nbsp;Article Image
            <span>&nbsp;(Obrázek)</span>
          </span>
          <i className={`icon ${item.visible ? `icon-menu-up` : `icon-menu-down`} icon-fw mr-2 mr-sm-1`}/>
        </div>

        {visibility && 
          <span>
            <hr />
            <textarea className="form-control" value={item.content}></textarea>
          </span>
        }

      </div>
    )
  }

  else if (item.type === 'video') {
    return (
      <div className="dt-card article-content article-video-content">

        <div className="article-content-top" onClick={() => setVisibility(!visibility)}>
          <span>
            <i className="icon icon-tab icon-fw content-icon mr-5" />
            &nbsp;Article Video
            <span>&nbsp;(Video)</span>
          </span>
          <i className={`icon ${item.visible ? `icon-menu-up` : `icon-menu-down`} icon-fw mr-2 mr-sm-1`}/>
        </div>

        {visibility && 
          <span>
            <hr />
            <textarea className="form-control" value={item.content}></textarea>
          </span>
        }

      </div>
    )
  }

  else {
    return <div></div>;
  }
}

export default ArticleContentHolder;