import Wether from "./Wether/Wether";
import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useState, useEffect} from 'react';
import Loader from "./loading/Loader";


function App() {
  const [isLoading, setLoading] = useState(true);
  setTimeout(()=>{setLoading(false)}, 3000);

  return (
    <div className="App">
     {isLoading ? <Loader/> : <Wether/>} 
     </div>
  );
}

export default App;
