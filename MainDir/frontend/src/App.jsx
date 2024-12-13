import { useState } from 'react'
import './App.css'
import CreateForm from './pages/CreateForm'
import SignupForm from './pages/SignUp'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SignInForm from './pages/SignIn'
import ViewForm from './pages/ViewForm'
import Home from './pages/Home'
import ShowFormResponses from './pages/ShowFormResponse'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'
import EditForm from './pages/EditForm'
import { ThemeProvider } from './components/ThemeProvider'

function App() {

  return (
    <>
    <ThemeProvider>
      <BrowserRouter>
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create-form" element={<CreateForm />} />
            <Route path="/sign-in" element={<SignInForm />} />
            <Route path="/sign-up" element={<SignupForm />} />
            <Route path="/forms/:formId" element={<ViewForm />} />
            <Route path="/edit-form/:formId" element={<EditForm />} />
            <Route path="/user-forms/:userId" element={<Dashboard />} />
            <Route path="/form-responses/:formId" element={<ShowFormResponses />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
    </>
  )
}

export default App
