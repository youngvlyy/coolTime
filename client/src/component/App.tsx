import React, { useState } from "react";
import FoodInfo from "../api/FoodInfo";

function App() {
  const [inputValue, setInputvalue] = useState("");
  const [food, setfood] = useState("");

  //입력한 음식 Inputvalue에 입력
  const Value=(e: React.ChangeEvent<HTMLInputElement>)=>{
    setInputvalue(e.target.value);
  }
  const Keydown= (e: React.KeyboardEvent<HTMLInputElement>)=>{
    if(e.key == 'Enter'){
      setfood(inputValue);
      
      //초기화
      setInputvalue("");
    }
  }

  
  return (
    <div className="App">
      
        <h1>Cool Time Goal</h1>
        <label>
          <input className='input w-[80%]' value={inputValue} type='text' onChange={(e)=>Value(e)} onKeyDown={(e)=>Keydown(e)}
                placeholder="쿨타임 지킬 음식을 적으시오"/>

        </label>
        {<FoodInfo foodNm = {food}/>}
        {/* {food && <FoodList Food ={food}/>} */}
      
    </div>
  );
}

export default App;
