import { FC, useEffect, useState } from 'react';
import DriveAPI, { ListedContents } from '../api/drive';
import { errorMsg } from '../api/error';
import File from '../components/File';
import Folder from '../components/Folder';
import PathNav from '../components/PathNav';
import FolderMaker from '../components/FolderMaker';
import { UploadIcon, AddFolderIcon, ReloadIcon } from '../icons/icons';

interface DriveProps {
  token: string;
  backLogin: () => void;
}

const Drive: FC<DriveProps> = props => {
  const [workDir, setDir] = useState('');
  const [contents, setContents] = useState<ListedContents>({ originPath: '', childs: [] });
  const [visible, setVisible] = useState(false);

  useEffect(() => getWorkFolderContent(), [workDir]);

  const setWorkDir = (path: string) => {
    setVisible(false);
    setDir(path);
  };

  const getWorkFolderContent = () => {
    DriveAPI.getFolder(workDir, props.token)
      .then(data => {
        if (errorHandler(data.error)) return;
        setContents(data.value);
      });
  };

  const errorHandler = (code: number, extra: string = ''): boolean => {
    if (code !== 0) {
      alert(errorMsg(code, extra));
      if (code === 4 || code === 5) {
        props.backLogin();
      }
      return true;
    }
    return false;
  };

  const download = async (name: string, originPath: string) => {
    let obj = await DriveAPI.getFile(`${originPath}/${name}`, props.token);
    if (errorHandler(obj.error)) return;
    let blobUrl = URL.createObjectURL(obj.value);
    let link = document.createElement('a');
    link.setAttribute('href', blobUrl);
    link.setAttribute('download', name);
    link.click();
  };

  const rename = async (name: string, newName: string, originPath: string) => {
    let obj = await DriveAPI.renameItem(`${originPath}/${name}`, props.token, newName);
    if (errorHandler(obj.error)) return;
    getWorkFolderContent();
  };

  const remove = async (name: string, originPath: string) => {
    let confr = confirm('Are you sure');
    if (!confr) return;
    let obj = await DriveAPI.deleteItem(`${originPath}/${name}`, props.token);
    if (errorHandler(obj.error)) return;
    let contentsCopy = { ...contents };
    let index = contentsCopy.childs.findIndex(item => item.name === name);
    if (index === -1) return;
    contentsCopy.childs.splice(index, 1);
    setContents(contentsCopy);
  };

  const mkdir = async (name: string) => {
    setVisible(false);
    let obj = await DriveAPI.mkdir(`${workDir}/${name}`, props.token);
    if (errorHandler(obj.error)) return;
    getWorkFolderContent();
  };

  const upload = async () => {
    let fileComp: HTMLInputElement = document.createElement('input');
    fileComp.setAttribute('type', 'file');
    fileComp.setAttribute('multiple', 'true');
    fileComp.onchange = async () => {
      let files = fileComp.files;
      if (files == null) return;
      for (let i = 0; i < files.length; i++) {
        let file = files[i];
        let obj = await DriveAPI.upload(workDir, props.token, file, false);
        if (obj.error == 2) {
          let confirm = window.confirm('This file already exists, you want to overwrite it');
          if (!confirm) return;
          obj = await DriveAPI.upload(workDir, props.token, file, true);
        }
        if (errorHandler(obj.error, file.name)) return;
      }
      getWorkFolderContent();
    };
    fileComp.click();
  };

  return (
    <div className="container">
      <PathNav
        path={contents.originPath}
        onOpen={path => {
          if (path === workDir)
            getWorkFolderContent();
          setWorkDir(path);
        }}
      />
      <div className="d-flex">
        <button onClick={upload} className="btn btn-primary">
          <UploadIcon />
        </button>
        <button onClick={() => setVisible(true)} className="btn btn-secondary ms-2">
          <AddFolderIcon />
        </button>
        <button onClick={() => (getWorkFolderContent())} className='btn btn-dark ms-2'>
          <ReloadIcon />
        </button>
      </div>
      <hr style={{ color: 'whitesmoke' }} />
      <ul className="m-0 p-0">
        {
          contents.childs.map(item => (
            item.type == 'file' ?
              <File
                name={item.name}
                size={item.size}
                originPath={contents.originPath}
                key={`${contents.originPath}/${item.name}`}
                onDownload={(name, path) => download(name, path)}
                onRename={rename}
                onRemove={(name, path) => remove(name, path)}
              />
              :
              <Folder
                name={item.name}
                originPath={contents.originPath}
                key={`${contents.originPath}/${item.name}`}
                onOpen={(name, path) => setWorkDir(`${path}/${name}`)}
                onRename={rename}
                onRemove={(name, path) => remove(name, path)}
              />
          ))
        }
        <FolderMaker
          onEsc={() => setVisible(false)}
          onEnt={(name) => mkdir(name)}
          visible={visible}
        />
      </ul>
    </div>
  );
};

export default Drive;