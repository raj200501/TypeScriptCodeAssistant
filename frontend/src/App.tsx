import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './pages/HomePage';
import EditorPage from './pages/EditorPage';
import SnippetsPage from './pages/SnippetsPage';
import RunsPage from './pages/RunsPage';
import SettingsPage from './pages/SettingsPage';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <Header />
      <main className="app-content">
        <Switch>
          <Route path="/" exact component={HomePage} />
          <Route path="/editor" component={EditorPage} />
          <Route path="/snippets" component={SnippetsPage} />
          <Route path="/runs" component={RunsPage} />
          <Route path="/settings" component={SettingsPage} />
        </Switch>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
