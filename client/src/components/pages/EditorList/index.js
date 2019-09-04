import React from 'react';
import axios from 'axios';

import EditorListTable from "./EditorListTable";
import Pagination from "../../ui/Pagination";

class EditorList extends React.Component {

  state = {
    allEditorsCount: 0,
    editors: [],
    isFetching: true,
    page: 1,
    paging: 1
  };

  fetchEditors = (skip, limit) => {
    axios.get(`/api/users/${skip}/${limit}`)
      .then(res => {
        const { allEditorsCount, editors } = res.data;
        this.setState({ allEditorsCount, editors, isFetching: false });
      })
  };

  componentDidMount() {
    this.fetchEditors(0, 10);
  }

  onEditorRemove = editorID => {
    console.log(`Editor ID: ${editorID}`);
  };

  onPageChange = numOfPage => {
    let skip = (numOfPage-1) * this.state.paging;
    let limit = (this.state.allEditorsCount-skip) > this.state.paging ? this.state.paging : (this.state.allEditorsCount-skip);
    this.setState({ isFetching: true });
    this.fetchArticles(skip, limit);
  };

  render() {
    const { editors, isFetching, allEditorsCount, paging } = this.state;

    return (
      <>
        <div className="dt-page__header">
          <h1 className="dt-page__title">Přehled redaktorů</h1>
        </div>

        <EditorListTable
          headItems={['Už. jméno', 'Email', 'Role', 'Redaktor od', 'Aktivní', 'Úpravy']}
          data={editors}
          noDataMessage={'Ještě nemáte žádného redaktora ...'}
          isFetching={isFetching}
          onEditorRemove={editorID => this.onEditorRemove(editorID)}
        />

        {allEditorsCount !== 0 && (
          <Pagination
            numberOfPages={Math.ceil(allEditorsCount/paging)}
            onPageChange={numOfPage => this.onPageChange(numOfPage)}
          />
        )}
      </>
    );
  }
}

export default EditorList;