# qpt-drive

This is an app for share your data in your local network, whose facilitates the shares data between the devices.

> The shared space is protected with a login system, next to the executable has a file called `server.key` which contains the password for access to de shared space.

> All of the files uploaded and the folder created are in the `uploads/` directory.

## Executables

You can download the portable app for [windows](https://github.com/Guillex387/qpt-drive/releases/download/v1.0.0/qpt-drive-win32-x64-v1.0.0.zip) and [linux](https://github.com/Guillex387/qpt-drive/releases/download/v1.0.0/qpt-drive-linux-x64-v1.0.0.zip) **last version**.

> In linux for execute this, you need the executable permission, this command only needs to be used once.
>
> `$ chmod +x ./drive`
>
> And then you can use the app.
>
> `$ ./drive $PORT`, the port is optional (default 8000).

## API *docs*:

> ### Error codes:
> - None error **0**
> - Item not found **1**
> - Item already exists **2**
> - Body format error **3**
> - Invalid token **4**
> - Expired token **5**
> - Invalid pass **6**
> - Invalid item name **7**

- Token **GET** `/api/token/:pass`

    This route is use for obtain the token, for access to server. The pass variable is the server key in base64.
    
    The response:
    ```json
    {
      "error": 0,
      "token": "some token"
    }
    ```

- Files & Folders **GET** `/api/:token/path/...`

    Put the path of the file or folder in the end of the url, this will return:
    If is a file will return a `blob`.
    Else will return a json which represent the content of the same, following this model:
    ```json
    {
      "originPath": "the/container/folder",
      "childs": [
        {
          "type": "file",
          "name": "some_file.txt",
          "size": 56
        },
        {
          "type": "folder",
          "name": "some_folder",
          "size": 0
        }
      ]
    }
    ```
    If some errors happenss:
    ```json
    {
      "error": 2
    }
    ```

- Files & Folders **DELETE** `/api/:token/path/...`

    This route is for delete some file or folder. Put the path of the file or folder in the end of the url.

    The response:
    ```json
    {
      "error": 0
    }
    ```

- Upload **POST & PUT** `/api/:token/upload`

    This url is for upload a single file, if is **PUT** req they will override the file if this exists, if is **POST** req and the file already exists a error will happenss.

    Request body model is a form data body following this model:
    | Param | Type |
    | --- | ----------- |
    | path | `string` |
    | file | `File` |

    The response:
    ```json
    {
      "error": 0
    }
    ```

- Make dir **POST** `/api/:token/mkdir`

    This url is for make a new directory.
    Use this model for the req body:
    ```json
    {
      "path": "container/newFolder"
    }
    ```
    The response:
    ```json
    {
      "error": 0
    }
    ```

- Rename **PUT** `/api/:token/rename`

    This route is for rename files or folders.

    Req body:
    ```json
    {
      "path": "parent/child.png",
      "newName": "new name.png"
    }
    ```
    The response:
    ```json
    {
      "error": 0
    }
    ```

## Frontend

I make the frontend using [react](https://reactjs.org) and [boostrap](https://getbootstrap.com).

> **Resources**
>
> All icons in the app are provided by [boostrap icons](https://icons.getbootstrap.com) in `.svg` format.


## License

Licensed under the [GNU AGPLv3](https://github.com/Guillex387/qpt-drive/blob/master/LICENSE). Copyright 2021 Guillex387