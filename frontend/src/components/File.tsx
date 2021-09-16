import React, { FC, useEffect, useState } from 'react';
import { FileIcon, DownloadIcon, PenIcon, TrashIcon } from '../icons/icons';

type FileEvent = (name: string, originPath: string) => void;
type KeyEvent = React.KeyboardEvent<HTMLInputElement>;
interface FileProps {
  name: string;
  size: number;
  originPath: string;
  onRemove?: FileEvent;
  onRename?: (oldName: string, newName: string, originPath: string) => void;
  onDownload?: FileEvent;
}

const formatSize = (size: number) => {
  const formatSizes = [
    {
      size: 1000000000,
      text: 'Gb'
    }, {
      size: 1000000,
      text: 'Mb'
    }, {
      size: 1000,
      text: 'Kb'
    }
  ];
  for (const formatSize of formatSizes) {
    if (size >= formatSize.size) {
      return `${(size / formatSize.size).toFixed(2)} ${formatSize.text}`;
    }
  }
  return `${size} b`;
};

const File: FC<FileProps> = props => {
  const [disabled, setDisabled] = useState(true);
  const [inputValue, setInputVal] = useState(props.name);

  const onInput = (ev: any) => setInputVal(ev.target.value);
  const onEnter = async (ev: KeyEvent) => {
    if (ev.key == 'Enter' && !disabled) {
      setDisabled(true);
      setInputVal(props.name);
      props.onRename && props.onRename(props.name, inputValue, props.originPath);
    }
  };
  const onEscape = (ev: KeyEvent) => {
    if (ev.key == 'Escape' && !disabled) {
      setDisabled(true);
      setInputVal(props.name);
    }
  };

  return (
    <div className="rounded bg-dark m-1 px-3 py-2 d-flex">
      <FileIcon fill="white" />
      <div className="d-flex align-items-center w-100">
        <div className="ms-2 text-white">
          <input style={{
            backgroundColor: 'transparent',
            borderColor: disabled ? 'transparent' : 'white',
            borderStyle: 'solid',
            borderWidth: 1,
            outline: 'none',
            padding: 0,
            paddingLeft: 2,
            paddingRight: 2,
            width: window.screen.width <= 576 ? '6em' : 'auto',
            margin: 0,
            color: 'white'
          }} className="w-sm-75" type="text" value={inputValue} onKeyUp={onEscape} onKeyPress={onEnter} onInput={onInput} disabled={disabled} />
        </div>
        <div className="ms-2 text-white text-nowrap">{formatSize(props.size)}</div>
        <div className="ms-auto d-flex flex-column flex-md-row">
          <div onClick={() => props.onDownload && props.onDownload(props.name, props.originPath)} className="btn btn-outline-primary m-1">
            <DownloadIcon />
          </div>
          <div onClick={() => {
            setDisabled(!disabled);
            !disabled && setInputVal(props.name);
          }} className="btn btn-outline-secondary m-1">
            <PenIcon />
          </div>
          <div onClick={() => props.onRemove && props.onRemove(props.name, props.originPath)} className="btn btn-outline-danger m-1">
            <TrashIcon />
          </div>
        </div>
      </div>
    </div>
  );
}

export default File;