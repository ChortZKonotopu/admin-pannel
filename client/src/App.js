import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LogIn from './pages/LogIn';
import Main from './pages/Main';

import {useStore} from './store.js'
import Placowki from './pages/Placowki';
import Pracowniki from './pages/Pracowniki';
import Header from './components/Header';
import Grafik from './pages/Grafik';
import CreateGrafik from './pages/CreateGrafik';


// import plus from './utils/plus.svg'
function App() {
  const isHeader = useStore((store) => store.header)
  

  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<LogIn />} />
        <Route path="/" exact element={<Header />}>
          <Route path="/placowki" exact element={<Placowki/>}/>
          <Route path="/pracowniki" exact element={<Pracowniki/>}/>
          <Route path="/main" exact element={<Main />} />
          <Route path="/grafik/:placowka/" exact element={<Grafik />} />
          <Route path="/createGrafik" exact element={<CreateGrafik />} />
        </Route>
      </Routes>
    </BrowserRouter>



    // <div className="App font-monserat">
    //   <input type="text" placeholder="Input" />
    //   <div className=""></div>
    //   <button className='button-secondary bg-orange'>Buton</button>
    //   <div className=""></div>
    //   <button className='button-primary'>Buton</button>
    //   <button className='button-add'>
    //     <img src={plus} alt="" />
    //     <p>Dobawyty</p>
    //   </button>
    //   <div className="">
    //   <a href="/" block>this is Link</a>
    //   </div>
    //   <div className="">
    //     <input  type="date" />
    //   </div>
    //   <div className="">
    //     <input name="check" type="checkbox" />
    //     <label for="check">Checkbox</label>
    //   </div>

    //   <label for="cars">Choose a car:</label>
    //   <div className="">
    //   <select id="cars" name="cars">
    //     <option value="volvo">Volvo</option>
    //     <option value="saab">Saab</option>
    //     <option value="fiat">Fiat</option>
    //     <option value="audi">Audi</option>
    //   </select>
    //   </div>
    // </div>
    
  );
}

export default App;
