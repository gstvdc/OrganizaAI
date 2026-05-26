import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BaseLayout } from './layouts/BaseLayout';
import { Home } from './pages/Home';
import { Simulation } from './pages/Simulation';
import { Result } from './pages/Result';
import { History } from './pages/History';
import { NotFound } from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BaseLayout />}>
          <Route index element={<Home />} />
          <Route path="simulacao" element={<Simulation />} />
          <Route path="historico" element={<History />} />
          <Route path="resultado/:id" element={<Result />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
