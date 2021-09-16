import { FC, useState } from 'react';
import { hostAPI } from '../api/config';
import { errorMsg } from '../api/error';

interface LoginProps {
  setToken: (token: string | null) => void
}

const Login: FC<LoginProps> = props => {
  const [pass, setPass] = useState("");

  const submit = async () => {
    let passB64 = btoa(pass);
    let resp = await fetch(`${hostAPI}/token/${passB64}`);
    if (resp.status === 401) {
      return alert(errorMsg(6));
    }
    let respJson: { error: number, token: string } = await resp.json();
    if (respJson.error !== 0) {
      return alert(errorMsg(respJson.error));
    }
    props.setToken(respJson.token);
  };

  return (
    <div className="m-4 d-flex justify-content-center align-items-center">
      <div className="card bg-dark">
        <div className="card-body">
          <h3 className="text-center text-white">Server key</h3>
          <input
            style={{ backgroundColor: '#343a40' }}
            className="form-control border-0 text-white mb-3"
            type="text"
            value={pass}
            onInput={(ev: any) => setPass(ev.target.value)}
          />
          <div className="d-flex justify-content-center align-items-center">
            <button onClick={submit} className="btn btn-primary">Login</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;