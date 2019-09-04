import React, {useEffect, useState} from 'react';

import('./Pagination.scss');

export default (props) => {
  const [activePage, setActivePage] = useState(props.activePage);
  const {numberOfPages} = props;

  useEffect(() => {
    setActivePage(props.activePage);
  }, [props.activePage]);

  const onPageClick = numOfPage => {
    props.onPageChange(numOfPage);
    setActivePage(numOfPage);
  };

  const onPreviousPageClick = () => {
    (activePage-1) >= 1 ? onPageClick(activePage-1) : onPageClick(numberOfPages)
  };

  const onNextPageClick = () => {
    (activePage+1) <= numberOfPages ? onPageClick(activePage+1) : onPageClick(1)
  };

  const renderNumbers = () => {
    let elements = [];
    for (let i = 1; i <= numberOfPages; i++) {
      elements.push(
        <li key={i} className="page-item" onClick={() => onPageClick(i)}>
          <span
            className={activePage === i ? 'page-link page-link-active' : 'page-link'}
          >{i}
          </span>
        </li>)
    }
    return elements;
  };

  return (
    <nav className={`cp-pagination ${props.className}`}>
      <ul className="pagination justify-content-end">
        <li className="page-item" onClick={() => onPreviousPageClick()}>
          <div className="page-link" aria-label="Previous">
            <span aria-hidden="true"><i className="icon icon-chevron-left"/></span>
            <span className="sr-only">Previous</span>
          </div>
        </li>

        {renderNumbers()}

        <li className="page-item" onClick={() => onNextPageClick()}>
          <div className="page-link" aria-label="Next">
            <span aria-hidden="true"><i className="icon icon-chevron-right"/></span>
            <span className="sr-only">Next</span>
          </div>
        </li>
      </ul>
    </nav>
  )
}