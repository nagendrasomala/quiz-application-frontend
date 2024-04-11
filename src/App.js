
import SigninUser from './components/signin';
import './App.css';
import { HashRouter,Routes,Route } from 'react-router-dom';
import Landingpage from './components/landingpage';
import Dashboard from './components/dashboard';
import QuizPage from './components/quizpage';
import AddQuestionPage from './components/addquestions';
import Leaderboard from './components/leaderboard';
import FacultyLandingpage from './components/facultylanding';
import FacultyDashboard from './components/facultydash';
import CreateQuiz from './components/createquiz';
import ViewData from './components/viewdata';

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Routes>
          <Route path='/signin' element={<SigninUser/>}/>
          <Route path='/' element={<Landingpage/>}/>
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/quizpage" element={<QuizPage/>}/>
          <Route path="/addquestions" element={<AddQuestionPage/>}/>
          <Route path='/leaderboard' element={<Leaderboard/>}/>
          <Route path="/faculty" element={<FacultyLandingpage/>}/>
          <Route path='/facultydashboard' element={<FacultyDashboard/>}/>
          <Route path='/createquiz' element={<CreateQuiz/>}/>
          <Route path='/viewdata' element={<ViewData/>}/>
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
