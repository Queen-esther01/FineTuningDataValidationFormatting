
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Validations from './pages/Validations'

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='' element={<Home/>}/>
				<Route path='/validations' element={<Validations/>}/>
			</Routes>
		</BrowserRouter>
	)
}

export default App
