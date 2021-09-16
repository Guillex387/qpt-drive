import { FC, useState } from 'react';
import { FolderIcon } from '../icons/icons';

type KeyEvent = React.KeyboardEvent<HTMLInputElement>;
interface FolderMakerProps {
  visible: boolean;
  onEsc?: () => void;
  onEnt?: (name: string) => void;
}


const FolderMaker: FC<FolderMakerProps> = props => {
  const [inputValue, setInputVal] = useState('');

  const onInput = (ev: any) => setInputVal(ev.target.value);
  const onEnter = (ev: KeyEvent) => {
    if (ev.key == 'Enter') {
      props.onEnt && props.onEnt(inputValue);
      setInputVal('');
    }
  };
  const onEscape = (ev: KeyEvent) => {
    if (ev.key == 'Escape') {
      props.onEsc && props.onEsc();
      setInputVal('');
    }
  };

  return (
    <>
      {
        props.visible ?
          <div className="rounded bg-dark m-1 px-3 py-2 d-flex">
            <FolderIcon fill="white" />
            <div className="ms-2 text-white">
              <input style={{
                backgroundColor: 'transparent',
                borderColor: 'white',
                borderStyle: 'solid',
                borderWidth: 1,
                outline: 'none',
                padding: 0,
                paddingLeft: 2,
                paddingRight: 2,
                margin: 0,
                color: 'white'
              }} type="text" value={inputValue} onKeyUp={onEscape} onKeyPress={onEnter} onInput={onInput} autoFocus />
            </div>
          </div>
          :
          null
      }
    </>
  );
}

export default FolderMaker;