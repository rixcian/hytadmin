import React, { useState } from 'react';
import axios from 'axios';
import { Upload, Icon, notification } from "antd";

export default props => {
  const [thumbnailFile, setThumbnailFile] = useState('');
  const [uploadedThumbnailFile, setUploadedThumbnailFile] = useState({});
  const [thumbnailLoading, setThumbnailLoading] = useState(false);
  const [coverFile, setCoverFile] = useState('');
  const [uploadedCoverFile, setUploadedCoverFile] = useState({});
  const [coverLoading, setCoverLoading] = useState(false);

  const beforeThumbnailUpload = file => setThumbnailFile(file);

  const onThumbnailUploadSubmit = () => {
    const formData = new FormData();
    formData.append('file', thumbnailFile);
    formData.append('oldThumbnailPath', props.imageThumbnailPath || '');
    formData.append('oldCoverPath', '');
    formData.append('articleID', props.articleID);
    formData.append('directory', 'thumbnails');

    axios.post('/api/upload', formData, {
      headers: {
        'Content-type': 'multipart/form-data'
      }
    })
    .then(res => {
      const { fileName, filePath } = res.data;
      setUploadedThumbnailFile({ fileName, filePath });
      setThumbnailLoading(false);
      props.setImageThumbnailPath(filePath);

      notification['success']({
        message: 'Náhledový obrázek se podařilo nahrát',
        description: 'Náhledový obrázek byl úspěšně nahrán na server.',
        placement: 'bottomRight'
      });
    })
    .catch(err => {
      setThumbnailLoading(false);
      notification['error']({
        message: 'Náhledový obrázek se nepodařilo nahrát',
        description: err.response.data,
        placement: 'bottomRight'
      });
    });
  };

  const handleThumbnailChange = info => {
    if (info.file.status === 'uploading') { return setThumbnailLoading(true) }
    if (info.file.status === 'done') setThumbnailLoading(false);
  };

  const beforeCoverUpload = file => setCoverFile(file);

  const onCoverUploadSubmit = () => {
    const formData = new FormData();
    formData.append('file', coverFile);
    formData.append('oldCoverPath', props.imageCoverPath || '');
    formData.append('oldThumbnailPath', '');
    formData.append('articleID', props.articleID);
    formData.append('directory', 'covers');

    axios.post('/api/upload', formData, {
      headers: {
        'Content-type': 'multipart/form-data'
      }
    })
      .then(res => {
        const { fileName, filePath } = res.data;
        setUploadedCoverFile({ fileName, filePath });
        setCoverLoading(false);
        props.setImageCoverPath(filePath);

        notification['success']({
          message: 'Cover obrázek se podařilo nahrát',
          description: 'Cover obrázek byl úspěšně nahrán na server.',
          placement: 'bottomRight'
        });
      })
      .catch(err => {
        setCoverLoading(false);
        notification['error']({
          message: 'Cover obrázek se nepodařilo nahrát',
          description: err.response.data,
          placement: 'bottomRight'
        });
      });
  };

  const handleCoverChange = info => {
    if (info.file.status === 'uploading') { return setCoverLoading(true) }
    if (info.file.status === 'done') setCoverLoading(false);
  };

  const UploadButton = props => (
    <div>
      <Icon type={thumbnailLoading ? 'loading' : 'plus'} />
      <div className="ant-upload-text mt-2">{props.buttonText}</div>
    </div>
  );

  return (
    <div className="row">
      <div className="col-md-6 col-sm-12" style={{ textAlign: 'center' }}>
        <Upload
          name="thumbnail"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          customRequest={onThumbnailUploadSubmit}
          beforeUpload={beforeThumbnailUpload}
          onChange={handleThumbnailChange}
        >
          {
            Object.keys(uploadedThumbnailFile).length !== 0
            ? <img src={uploadedThumbnailFile.filePath + `?${new Date().getTime()}`} alt="avatar" style={{ width: '100%' }} />
            : props.imageThumbnailPath
              ? <img src={props.imageThumbnailPath+ `?${new Date().getTime()}`} alt="avatar" style={{ width: '100%' }} />
              : <UploadButton buttonText="Náhledový obrázek" />
          }
        </Upload>
        <p>Náhledový obrázek</p>
      </div>
      <div className="col-md-6 col-sm-12" style={{ textAlign: 'center' }}>
        <Upload
          name="thumbnail"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          customRequest={onCoverUploadSubmit}
          beforeUpload={beforeCoverUpload}
          onChange={handleCoverChange}
        >
          {
            Object.keys(uploadedCoverFile).length !== 0
            ? <img src={uploadedCoverFile.filePath + `?${new Date().getTime()}`} alt="avatar" style={{ width: '100%' }} />
            : props.imageCoverPath
              ? <img src={props.imageCoverPath + `?${new Date().getTime()}`} alt="avatar" style={{ width: '100%' }} />
              : <UploadButton buttonText="Cover obrázek" />
          }
        </Upload>
        <p>Cover obrázek</p>
      </div>
    </div>
  )
}