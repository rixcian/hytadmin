import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { Upload, notification } from 'antd';

const { Dragger } = Upload;

const onVideoUploadSubmit = (data, props, setOldVideoPath) => {

  const { oldVideoPath, onChange } = props;
  
  const formData = new FormData();
  formData.append('file', data.file);
  formData.append('directory', 'videos');
  formData.append('oldVideoPath', oldVideoPath || '');

  axios.post('/api/upload/video', formData, {
    headers: {
      'Content-type': 'multipart/form-data'
    }
  })
  .then(res => {
    setOldVideoPath(res.data.filePath);
    onChange(res.data.filePath);
    notification['success']({
      message: 'Video se podařilo nahrát',
      description: 'Video bylo úspěšně nahráno na server.',
      placement: 'bottomRight'
    });
  })
  .catch(err => {
    notification['error']({
      message: 'Video se nepodařilo nahrát',
      description: err.response.data,
      placement: 'bottomRight'
    });
  });

}


const UploadArticleVideo = props => {

  const [oldVideoPath, setOldVideoPath] = useState(props.oldVideoPath);

  const videoUploadProps = {
    name: 'file',
    multiple: false,
    showUploadList: false,
    customRequest: 
      data => onVideoUploadSubmit(data, props, setOldVideoPath)
  }

  return (
    <Dragger {...videoUploadProps}>
      <p className="ant-upload-drag-icon">
        
        {!oldVideoPath 
          ? (
            <FontAwesomeIcon
              icon="cloud-upload-alt"
              style={{ width: "6rem", height: "6rem" }}
            />
          )
          : (
            <video width="240" height="160" controls>
              <source src={oldVideoPath} type="video/mp4" />
            </video>
          )
        }
        
      </p>
      <p className="ant-upload-hint">
        Klikněte nebo přetáhněte soubory do této oblasti k náhrání
      </p>
    </Dragger>
  );
};

export default UploadArticleVideo;
