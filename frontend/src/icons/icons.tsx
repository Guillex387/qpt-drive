import { FC } from 'react';

interface IconProps {
  size?: number;
  fill?: string;
}

const Center: FC = ({ children }) => {
  return (
    <div className="d-flex justify-content-center align-items-center">
      {children}
    </div>
  );
};

export const FileIcon: FC<IconProps> = props => {
  const size = props.size ? props.size.toFixed(1) : "24";
  return (
    <Center>
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill={props.fill || "currentColor"} className="bi bi-file-earmark-text-fill" viewBox="0 0 16 16">
        <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zM4.5 9a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1h-7zM4 10.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm.5 2.5a.5.5 0 0 1 0-1h4a.5.5 0 0 1 0 1h-4z" />
      </svg>
    </Center>
  );
};

export const FolderIcon: FC<IconProps> = props => {
  const size = props.size ? props.size.toFixed(1) : "24";
  return (
    <Center>
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill={props.fill || "currentColor"} className="bi bi-folder-fill" viewBox="0 0 16 16">
        <path d="M9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.825a2 2 0 0 1-1.991-1.819l-.637-7a1.99 1.99 0 0 1 .342-1.31L.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3zm-8.322.12C1.72 3.042 1.95 3 2.19 3h5.396l-.707-.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139z" />
      </svg>
    </Center>
  );
};

export const PenIcon: FC<IconProps> = props => {
  const size = props.size ? props.size.toFixed(1) : "16";
  return (
    <Center>
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill={props.fill || "currentColor"} className="bi bi-pen-fill" viewBox="0 0 16 16">
        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001z" />
      </svg>
    </Center>
  );
};

export const TrashIcon: FC<IconProps> = props => {
  const size = props.size ? props.size.toFixed(1) : "16";
  return (
    <Center>
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill={props.fill || "currentColor"} className="bi bi-trash-fill" viewBox="0 0 16 16">
        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
      </svg>
    </Center>
  );
};

export const DownloadIcon: FC<IconProps> = props => {
  const size = props.size ? props.size.toFixed(1) : "16";
  return (
    <Center>
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill={props.fill || "currentColor"} className="bi bi-arrow-down-circle-fill" viewBox="0 0 16 16">
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z" />
      </svg>
    </Center>
  );
};

export const UploadIcon: FC<IconProps> = props => {
  const size = props.size ? props.size.toFixed(1) : "24";
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill={props.fill || "currentColor"} className="bi bi-cloud-arrow-up" viewBox="0 0 16 16">
      <path d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2z" />
      <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z" />
    </svg>
  );
};

export const AddFolderIcon: FC<IconProps> = props => {
  const size = props.size ? props.size.toFixed(1) : "24";
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill={props.fill || "currentColor"} className="bi bi-folder-plus" viewBox="0 0 16 16">
      <path d="m.5 3 .04.87a1.99 1.99 0 0 0-.342 1.311l.637 7A2 2 0 0 0 2.826 14H9v-1H2.826a1 1 0 0 1-.995-.91l-.637-7A1 1 0 0 1 2.19 4h11.62a1 1 0 0 1 .996 1.09L14.54 8h1.005l.256-2.819A2 2 0 0 0 13.81 3H9.828a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 6.172 1H2.5a2 2 0 0 0-2 2zm5.672-1a1 1 0 0 1 .707.293L7.586 3H2.19c-.24 0-.47.042-.683.12L1.5 2.98a1 1 0 0 1 1-.98h3.672z" />
      <path d="M13.5 10a.5.5 0 0 1 .5.5V12h1.5a.5.5 0 1 1 0 1H14v1.5a.5.5 0 1 1-1 0V13h-1.5a.5.5 0 0 1 0-1H13v-1.5a.5.5 0 0 1 .5-.5z" />
    </svg>
  );
};

export const ReloadIcon: FC<IconProps> = props => {
  const size = props.size ? props.size.toFixed(1) : "24";
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill={props.fill || "currentColor"} className="bi bi-arrow-clockwise" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
      <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
    </svg>
  );
};