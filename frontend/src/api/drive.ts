import { hostAPI } from './config';

export interface SysItem {
  type: 'file' | 'folder';
  name: string;
  size: number;
}

export interface ListedContents {
  originPath: string;
  childs: SysItem[];
}

class Drive {
  static async getToken(pass: string): Promise<{ error: number, token: string }> {
    let resp = await fetch(`${hostAPI}/token/${pass}`);
    return await resp.json();
  }
  static async getFolder(path: string, token: string): Promise<{ value: ListedContents, error: number }> {
    let resp = await fetch(`${hostAPI}/${token}/path/${path}`, { method: 'GET' });
    if (!resp.ok) {
      let json: { error: number } = await resp.json();
      return {
        value: { originPath: '', childs: [] },
        error: json.error
      };
    }
    let contents: ListedContents;
    if (!resp.headers.get('Content-type')?.includes('application/json'))
      return { value: { originPath: '', childs: [] }, error: 1 };
    contents = await resp.json();
    if (contents.childs == null) contents.childs = [];
    return {
      value: contents,
      error: 0
    };
  }
  static async getFile(path: string, token: string): Promise<{ value: Blob, error: number }> {
    let resp = await fetch(`${hostAPI}/${token}/path/${path}`, { method: 'GET' });
    if (!resp.ok) {
      let json: { error: number } = await resp.json();
      return {
        value: new Blob(),
        error: json.error
      };
    }
    let contents: Blob;
    if (resp.headers.get('Content-type')?.includes('application/json'))
      return { value: new Blob(), error: 1 };
    contents = await resp.blob();
    return {
      value: contents,
      error: 0
    };
  }
  static async deleteItem(path: string, token: string): Promise<{ error: number }> {
    let resp = await fetch(`${hostAPI}/${token}/path/${path}`, { method: 'DELETE' });
    return await resp.json();
  }
  static async renameItem(path: string, token: string, newName: string): Promise<{ error: number }> {
    let reqBody = {
      path,
      newName
    };
    let resp = await fetch(`${hostAPI}/${token}/rename`, { method: 'PUT', body: JSON.stringify(reqBody) });
    return await resp.json();
  }
  static async mkdir(path: string, token: string): Promise<{ error: number }> {
    let reqBody = { path };
    let resp = await fetch(`${hostAPI}/${token}/mkdir`, { method: 'POST', body: JSON.stringify(reqBody) });
    return await resp.json();
  }
  static async upload(path: string, token: string, file: File, override: boolean): Promise<{ error: number }> {
    let reqBody = new FormData();
    reqBody.append("file", file);
    reqBody.append("path", `${path}/${file.name}`);
    let resp = await fetch(`${hostAPI}/${token}/upload`, {
      method: override ? 'PUT' : 'POST',
      body: reqBody
    });
    return await resp.json();
  }
}

export default Drive;