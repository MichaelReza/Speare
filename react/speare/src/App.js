import logo from './logo.svg';
import {HashRouter as Router, Switch, Route} from 'react-router-dom';
import './App.css';
import Landing from './components/pages/Landing';
import Home from './components/pages/Home';

function App() {
  return (
    <Router basename='/'>
      <div className="page-container">
        <Switch>
          <Route path='/' exact component={Landing}/>
          <Route path='/about' exact component={Home} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
