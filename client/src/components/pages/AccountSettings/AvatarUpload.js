import React, { useState } from 'react';
import { Upload, Icon } from 'antd';
import axios from 'axios';

const { Dragger } = Upload;

export default props => {

  const [oldAvatarPath, setOldAvatarPath] = useState(props.avatarPath);
  const [avatarPath, setAvatarPath] = useState('');
  const [uploadMessage, setUploadMessage] = useState('Kliknutím nebo přetáhnutím obrázku nahrajete nový avatar');
  const [avatarFile, setAvatarFile] = useState({});

  const uploadProps = {
    name: 'file',
    multiple: false,
    showUploadList: false,
    onChange: info => {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
        setUploadMessage('Nahrávání ...');
      }
    },
    beforeUpload: file => setAvatarFile(file),
    customRequest: () => {
      const formData = new FormData();
      formData.append('file', avatarFile);
      formData.append('oldAvatarPath', props.avatarPath || '');

      axios.post('/api/upload/avatar', formData, {
        headers: {
          'Content-type': 'multipart/form-data'
        }
      })
      .then(res => {
        const { filePath } = res.data;
        setOldAvatarPath(filePath);
        setAvatarPath(filePath);
        props.onUploadSuccess();
        setUploadMessage('<p class="text-success">Obrázek se úspěšně nahrál.</p>');
        setTimeout(() => setUploadMessage('Kliknutím nebo přetáhnutím obrázku nahrajete nový avatar'), 2500);
      })
      .catch(err => console.log(err));
  },
};

  return (
    <div className="m-4">
      <Dragger {...uploadProps}>
        <p className="ant-upload-drag-icon">
          {avatarPath !== '' ?
            <picture>
              <source srcSet={avatarPath + `?${new Date().getTime()}`} type="image/webp"/>
              <source srcSet={avatarPath + `?${new Date().getTime()}`} type="image/png"/>
              <img className="dt-avatar size-40" src={avatarPath + `?${new Date().getTime()}`} alt="rixcian"/>
            </picture>
          : oldAvatarPath !== '' ?
                <picture>
                  <source srcSet={oldAvatarPath + `?${new Date().getTime()}`} type="image/webp"/>
                  <source srcSet={oldAvatarPath + `?${new Date().getTime()}`} type="image/png"/>
                  <img className="dt-avatar size-40" src={oldAvatarPath + `?${new Date().getTime()}`} alt="rixcian"/>
                </picture>
              :
                <Icon type="inbox" style={{ color: '#262626' }}/>
          }
        </p>
        <p className="ant-upload-hint"><span dangerouslySetInnerHTML={{ __html: uploadMessage}} /></p>
      </Dragger>
    </div>
  )
};