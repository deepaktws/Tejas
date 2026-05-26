import { BrowserRouter } from 'react-router-dom'
import Routers from './Routers'
import { Provider } from 'react-redux'
import { store } from './store'
import { Toast } from './components/ui'
function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routers />
        <Toast />
      </BrowserRouter>
    </Provider>
  )
}

export default App
