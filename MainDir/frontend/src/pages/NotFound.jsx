import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div
      style={{
        textAlign: 'center',
        marginTop: '50px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1
        style={{
          fontSize: '3rem',
          color: '#ff5555',
        }}
      >
        404 - Page Not Found
      </h1>
      <p
        style={{
          fontSize: '1.2rem',
          margin: '20px 0',
          color: '#555',
        }}
      >
        Oops! The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        style={{
          textDecoration: 'none',
          color: '#007bff',
          fontWeight: 'bold',
          fontSize: '1rem',
        }}
      >
        Go back to Home
      </Link>
    </div>
  )
}

export default NotFound
