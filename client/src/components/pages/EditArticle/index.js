import React from 'react';
import CKEditor from 'ckeditor4-react';
import axios from 'axios';
import { notification, Icon } from 'antd';
import UploadThumbnails from "../../ui/UploadThumbnails";

class EditArticle extends React.Component {

  state = {
    title: '',
    content: '',
    thumbnailImagePath: '',
    coverImagePath: '',
    isFetching: true
  };

  setImageThumbnailPath = path => this.setState({ thumbnailImagePath: path });

  setImageCoverPath = path => this.setState({ coverImagePath: path });

  componentDidMount() {
    console.log(this.props.match.params.id);
    axios.get(`/api/articles/${this.props.match.params.id}`)
    .then(res => {
      const { title, content, thumbnailImagePath, coverImagePath } = res.data;
      this.setState({ title, content, thumbnailImagePath, coverImagePath, isFetching: false });
    })
    .catch(err => {
      notification['error']({
        message: 'Článek se nepodařilo načíst',
        description: err.response.data,
        placement: 'bottomRight'
      });
      this.props.history.push('/articles');
    });
  }

  saveArticle = () => {
    const { title, content, thumbnailImagePath, coverImagePath } = this.state;
    axios.put(`/api/articles/${this.props.match.params.id}`,
      { title, content, thumbnailImagePath, coverImagePath })
      .then(() => {
        notification['success']({
          message: 'Článek byl úspěšně upraven',
          description: 'Váš článek byl úspěšně upraven a nahrán do databáze.',
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
    const { isFetching } = this.state;

    return (
      <>
        <div className="dt-page__header">
          <h1 className="dt-page__title">Editace článku</h1>
        </div>

        {isFetching ? (
          <div className="dt-card">
            <div className="dt-card__body text-center">
              <Icon type="sync" spin style={{ padding: '40px', fontSize: '3rem' }}/>
            </div>
          </div>
        ) : (

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
                  imageThumbnailPath={this.state.thumbnailImagePath}
                  imageCoverPath={this.state.coverImagePath}
                  articleID={this.props.match.params.id}
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

        )}
      </>
    );
  }
}

export default EditArticle;