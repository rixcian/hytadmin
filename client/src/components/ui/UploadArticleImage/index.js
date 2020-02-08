import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { Upload, notification } from 'antd';

const { Dragger } = Upload;

const onImageUploadSubmit = (data, props, setOldImagePath) => {

  const { oldImagePath, onChange } = props;
  
  const formData = new FormData();
  formData.append('file', data.file);
  formData.append('directory', 'images');
  formData.append('oldImagePath', oldImagePath || '');

  axios.post('/api/upload/image', formData, {
    headers: {
      'Content-type': 'multipart/form-data'
    }
  })
  .then(res => {
    setOldImagePath(res.data.filePath);
    onChange(res.data.filePath);
    notification['success']({
      message: 'Obrázek se podařilo nahrát',
      description: 'Obrázek byl úspěšně nahrán na server.',
      placement: 'bottomRight'
    });
  })
  .catch(err => {
    notification['error']({
      message: 'Obrázek se nepodařilo nahrát',
      description: err.response.data,
      placement: 'bottomRight'
    });
  });

}


const UploadArticleImage = props => {

  const [oldImagePath, setOldImagePath] = useState(props.oldImagePath);

  const imageUploadProps = {
    name: 'file',
    multiple: false,
    showUploadList: false,
    customRequest: 
      data => onImageUploadSubmit(data, props, setOldImagePath)
  }

  return (
    <Dragger {...imageUploadProps}>
      <p className="ant-upload-drag-icon">
        
        {!oldImagePath 
          ? (
            <FontAwesomeIcon
              icon="cloud-upload-alt"
              style={{ width: "6rem", height: "6rem" }}
            />
          )
          : (
            <img 
              src={oldImagePath} 
              alt="Article"
              style={{maxWidth: '128px'}}
            />
          )
        }
        
      </p>
      <p className="ant-upload-hint">
        Klikněte nebo přetáhněte soubory do této oblasti k náhrání
      </p>
    </Dragger>
  );
};

export default UploadArticleImage;
