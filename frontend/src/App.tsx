import { BrowserRouter } from 'react-router-dom'
import Routers from './Routers'
import { Provider } from 'react-redux'
import { store } from './store'
function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routers />
      </BrowserRouter>
    </Provider>
  )
}

export default App
