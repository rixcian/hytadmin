import React, { useEffect } from "react";
import { ReactSortable } from "react-sortablejs";
import ArticleContentHolder from "../ArticleContentHolder";
import PropTypes from "prop-types";

const ArticleContentWrapper = props => {

  const content = props.initialContent;

  useEffect(() => {

  });

  const itemChanged = (item, index) => {
    console.log("change");
    let newContent = content;
    newContent[index] = item;
    props.onContentUpdate(newContent);
  };

  const updateArticleItem = newItem => {
    let newContent = content;
    let oldItemIndex = newContent.findIndex(item => item.id === newItem.id);
    newContent[oldItemIndex] = newItem;
    props.onContentUpdate(newContent);
  };

  return (
    <div className="form-group">
      <label>Obsah článku</label>
      <ReactSortable
        list={content}
        setList={newList => props.onContentUpdate(newList)}
      >
        {content.map((item, i) => (
          <ArticleContentHolder
            key={item.id}
            item={item}
            onItemChange={item => updateArticleItem(item)}
          />
        ))}
      </ReactSortable>
    </div>
  );
};

ArticleContentWrapper.propTypes = {
  initialContent: PropTypes.array,
  onContentUpdate: PropTypes.func
};

export default ArticleContentWrapper;