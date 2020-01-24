import React from 'react';
import axios from 'axios';
import { notification } from "antd";

import EditorListTable from "./EditorListTable";
import Pagination from "../../ui/Pagination";

class EditorList extends React.Component {

  state = {
    allEditorsCount: 0,
    editors: [],
    isFetching: true,
    page: 1,
    paging: 10,
    activePage: 1,
    numberOfPages: 1
  };

  fetchEditors = (skip, limit) => {
    this.setState({ isFetching: true });
    axios.get(`/api/users/${skip}/${limit}`)
      .then(res => {
        const { allEditorsCount, editors } = res.data;
        this.setState({ allEditorsCount, editors,
          isFetching: false,
          numberOfPages: Math.ceil(allEditorsCount/this.state.paging)
        });
      })
  };

  componentDidMount() {
    this.fetchEditors(0, this.state.paging);
  }

  onEditorRemove = editorID => {
    console.log(`Editor ID: ${editorID}`);
    axios.delete(`/api/users/${editorID}`)
        .then(res => {
          this.fetchEditors(0, 10);
          notification['success']({
            message: 'Redaktor byl odstraněn',
            description: 'Vámi zvolený redaktor byl úspěšně smazán z databáze.',
            placement: 'bottomRight'
          });
        })
        .catch(errResponse => {
          notification['error']({
            message: 'Redaktor nebyl odstraněn',
            description: 'Vámi zvolený redaktor nebyl odstraněn. Zkuste znovu načíst stránku.',
            placement: 'bottomRight'
          });
        })
  };

  onPageChange = numOfPage => {
    let skip = (numOfPage-1) * this.state.paging;
    let limit = (this.state.allEditorsCount-skip) > this.state.paging ? this.state.paging : (this.state.allEditorsCount-skip);
    this.setState({ isFetching: true });
    this.fetchEditors(skip, limit);
  };

  render() {
    const { editors, isFetching, allEditorsCount, activePage, numberOfPages } = this.state;

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
            numberOfPages={numberOfPages}
            onPageChange={numOfPage => this.onPageChange(numOfPage)}
            activePage={activePage}
          />
        )}
      </>
    );
  }
}

export default EditorList;