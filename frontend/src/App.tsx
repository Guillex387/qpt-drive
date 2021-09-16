import { FC, useState } from 'react';
import Drive from './pages/Drive';
import Login from './pages/Login';

const App: FC = () => {
  const [token, setToken] = useState<string | null>(null);
  return (
    <div>
      <nav className="navbar navbar-dark bg-dark shadow-sm mb-2">
        <div className="container-fluid">
          <div className="navbar-brand">qpt-drive</div>
        </div>
      </nav>
      {
        token === null ?
          <Login setToken={t => setToken(t)} />
          :
          <Drive token={token} backLogin={() => setToken(null)} />
      }
    </div>
  );
};

export default App;
