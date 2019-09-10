import React from 'react';
import CKEditor from 'ckeditor4-react';
import axios from 'axios';
import { notification } from 'antd';

import UploadThumbnails from '../../ui/UploadThumbnails';

class NewArticle extends React.Component {

  state = {
    title: '',
    content: '',
    thumbnailImagePath: '',
    coverImagePath: ''
  };

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
              <label htmlFor="email-1">Obsah</label>
              <CKEditor
                data={this.state.content}
                onChange={(e) => this.setState({ content: e.editor.getData() })}
              />
            </div>

            <div className="form-group" style={{ textAlign: 'right' }}>
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