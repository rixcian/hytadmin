import React from "react";
import { ReactSortable } from "react-sortablejs";
import PropTypes from "prop-types";

import { Empty } from 'antd';
import ArticleContentHolder from "../ArticleContentHolder";

const ArticleContentWrapper = props => {
  
  const content = props.initialContent;

  const updateArticleItem = newItem => {
    let newContent = content;
    let oldItemIndex = newContent.findIndex(item => item.id === newItem.id);
    newContent[oldItemIndex] = newItem;
    props.onContentUpdate(newContent);
  };

  if (content.length !== 0) {
    return (
      <ReactSortable
        list={content}
        setList={newList => props.onContentUpdate(newList)}
      >
        {content.map((item, i) => (
          <ArticleContentHolder
            key={item.id}
            item={item}
            onItemChange={item => updateArticleItem(item)}
            onDeleteItem={item => props.onDeleteItem(item)}
          />
        ))}
      </ReactSortable>
    );
  } else {
    return <Empty description={"Nic tu není 😿"} />;
  }
};

ArticleContentWrapper.propTypes = {
  initialContent: PropTypes.array,
  onContentUpdate: PropTypes.func
};

export default ArticleContentWrapper;
