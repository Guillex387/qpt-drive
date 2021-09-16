import { FC } from 'react';

interface PathNavProps {
  path: string;
  onOpen?: (path: string) => void;
}

const PathNav: FC<PathNavProps> = props => {
  let splittedPath = props.path.split('/');
  if (props.path == '') {
    splittedPath = ['Main'];
  } else {
    splittedPath.unshift('Main');
  }

  const toAbs = (route: string): string => {
    let splittedPathCopy = [...splittedPath];
    splittedPathCopy.shift();
    let abs: string[] = [];
    for (const item of splittedPathCopy) {
      if (item == route) {
        abs.push(item);
        return abs.join('/');
      }
      abs.push(item);
    }
    return '';
  };

  return (
    <nav className="fs-4" aria-label="breadcrumb">
      <ol className="breadcrumb">
        {
          splittedPath.map((route, i) => (
            <li key={i} className="breadcrumb-item">
              <a
                className="link noselect"
                onClick={() => {
                  if (i === 0) {
                    props.onOpen && props.onOpen('');
                    return;
                  }
                  props.onOpen && props.onOpen(toAbs(route));
                }}
              >{route}</a>
            </li>
          ))
        }
      </ol>
    </nav>
  )
};

export default PathNav;
