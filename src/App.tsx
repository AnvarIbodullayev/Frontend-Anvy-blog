import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './pages/Layout'
import Home from './pages/Home'
import Admin from './pages/Admin'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import PageNotFound from './pages/404'
import Profile from './pages/Profile'
import ForgotPassword from './pages/ForgotPassword'
import ChangePassword from './pages/ChangePassword'
import MyPosts from './pages/MyPosts'
import GlobalField from './pages/GlobalField'
import EachPost from './pages/EachPost'

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='admin' element={<Admin />} />

          {/* Auth pages */}
          <Route path="profile" element={<Profile />} />
          <Route path="forgotpassword" element={<ForgotPassword />} />
          <Route path="changepassword" element={<ChangePassword />} />
          <Route path="signin" element={<SignIn />} />
          <Route path="signup" element={<SignUp />} />

          {/* blog posts */}
          <Route path="myposts" element={<MyPosts />} />
          <Route path="globalfield" element={<GlobalField />} />
          <Route path="eachpost/:id" element={<EachPost />} />

          {/* 404 */}
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
