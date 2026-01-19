import './App.css'
import Header from "./components/Header"
import Body from "./components/Body"
import { BrowserRouter } from 'react-router-dom'


function App() {


  return (
    <>
      <BrowserRouter>
        <Header />
        <Body />

      </BrowserRouter>
    </>
  )
}

export default App
