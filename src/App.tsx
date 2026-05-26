import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BaseLayout } from './layouts/BaseLayout';
import { Home } from './pages/Home';
import { Simulation } from './pages/Simulation';
import { Result } from './pages/Result';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BaseLayout />}>
          <Route index element={<Home />} />
          <Route path="simulacao" element={<Simulation />} />
          <Route path="resultado/:id" element={<Result />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
