
import SigninUser from './components/signin';
import './App.css';
import { HashRouter,Routes,Route } from 'react-router-dom';
import Landingpage from './components/landingpage';
import Dashboard from './components/dashboard';
import QuizPage from './components/quizpage';
import AddQuestionPage from './components/addquestions';
import Leaderboard from './components/leaderboard';

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Routes>
          <Route path='/signin' element={<SigninUser/>}/>
          <Route path='/' element={<Landingpage/>}/>
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/quizpage" element={<QuizPage/>}/>
          <Route path="/add123" element={<AddQuestionPage/>}/>
          <Route path='/leaderboard' element={<Leaderboard/>}/>
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
