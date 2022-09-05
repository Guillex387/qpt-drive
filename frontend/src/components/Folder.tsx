import { FC, useState } from 'react';
import { FolderIcon, PenIcon, TrashIcon } from '../icons/icons';

type FolderEvent = (name: string, originPath: string) => void;
type KeyEvent = React.KeyboardEvent<HTMLInputElement>;
interface FolderProps {
  name: string;
  originPath: string;
  onRemove?: FolderEvent;
  onRename?: (name: string, newName: string, originPath: string) => void;
  onOpen?: FolderEvent;
}

const Folder: FC<FolderProps> = props => {
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
      <div onDoubleClick={() => disabled && props.onOpen && props.onOpen(props.name, props.originPath)} className="d-flex justify-content-center align-items-center">
        <FolderIcon fill="white" />
      </div>
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
            color: 'white',
            userSelect: 'none'
          }}
          type="text"
          value={inputValue}
          onKeyUp={onEscape}
          onKeyPress={onEnter}
          onInput={onInput}
          disabled={disabled}
          />
        </div>
        <div className="ms-auto d-flex flex-column flex-md-row">
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

export default Folder;